import tkinter as tk
from tkinter import ttk, messagebox
import threading
import queue
import time
import re
import traceback
import logging

import config
from lead import (
    create_driver,
    safe_load,
    _extract_text,
    _extract_city,
    _find_instagram,
    save_to_excel
)
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

class ExtractorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Google Maps Lead Extractor")
        self.root.geometry("1000x650")
        
        # Styling
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TFrame", background="#f4f4f5")
        style.configure("TLabel", background="#f4f4f5", font=("Segoe UI", 10))
        style.configure("Header.TLabel", font=("Segoe UI", 16, "bold"), foreground="#0f172a")
        style.configure("TButton", font=("Segoe UI", 10, "bold"), padding=6)
        
        self.root.configure(bg="#f4f4f5")
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(2, weight=1)
        
        # --- Top Frame ---
        top_frame = ttk.Frame(root, padding=15)
        top_frame.grid(row=0, column=0, sticky="ew")
        top_frame.columnconfigure(1, weight=1)
        
        ttk.Label(top_frame, text="Google Maps Lead Extractor", style="Header.TLabel").grid(row=0, column=0, columnspan=3, pady=(0, 15), sticky="w")
        
        ttk.Label(top_frame, text="Search URL:").grid(row=1, column=0, padx=(0, 5))
        self.url_entry = ttk.Entry(top_frame, width=70, font=("Segoe UI", 10))
        self.url_entry.grid(row=1, column=1, sticky="ew", padx=5)
        
        self.start_btn = ttk.Button(top_frame, text="Start Extraction", command=self.start_extraction)
        self.start_btn.grid(row=1, column=2, padx=(5, 0))
        
        # --- Middle Frame (Progress) ---
        mid_frame = ttk.Frame(root, padding=(15, 0, 15, 10))
        mid_frame.grid(row=1, column=0, sticky="ew")
        mid_frame.columnconfigure(1, weight=1)
        
        self.status_var = tk.StringVar(value="Status: Ready.")
        ttk.Label(mid_frame, textvariable=self.status_var, font=("Segoe UI", 10, "italic"), foreground="#334155").grid(row=0, column=0, sticky="w")
        
        self.progress = ttk.Progressbar(mid_frame, orient="horizontal", mode="determinate")
        self.progress.grid(row=0, column=1, sticky="ew", padx=(15, 0))
        
        # --- Bottom Frame (Table) ---
        bot_frame = ttk.Frame(root, padding=15)
        bot_frame.grid(row=2, column=0, sticky="nsew")
        bot_frame.columnconfigure(0, weight=1)
        bot_frame.rowconfigure(0, weight=1)
        
        columns = ("Name", "City", "Phone", "Website", "Instagram", "Notes")
        self.tree = ttk.Treeview(bot_frame, columns=columns, show="headings", style="Treeview")
        
        widths = {"Name": 200, "City": 100, "Phone": 120, "Website": 200, "Instagram": 150, "Notes": 150}
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=widths[col], anchor="w")
        
        scrollbar_y = ttk.Scrollbar(bot_frame, orient="vertical", command=self.tree.yview)
        scrollbar_x = ttk.Scrollbar(bot_frame, orient="horizontal", command=self.tree.xview)
        self.tree.configure(yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)
        
        self.tree.grid(row=0, column=0, sticky="nsew")
        scrollbar_y.grid(row=0, column=1, sticky="ns")
        scrollbar_x.grid(row=1, column=0, sticky="ew")
        
        self.queue = queue.Queue()
        self.is_running = False
        
        self.root.after(100, self.process_queue)

    def start_extraction(self):
        url = self.url_entry.get().strip()
        if not url:
            messagebox.showwarning("Input Error", "Please provide a Google Maps URL.")
            return

        # Clear treeview
        for row in self.tree.get_children():
            self.tree.delete(row)
            
        self.start_btn.config(state="disabled")
        self.url_entry.config(state="disabled")
        self.is_running = True
        self.progress["value"] = 0
        
        threading.Thread(target=self.scrape_thread, args=(url,), daemon=True).start()

    def process_queue(self):
        try:
            while True:
                msg = self.queue.get_nowait()
                if msg["type"] == "status":
                    self.status_var.set("Status: " + msg["text"])
                    if "progress" in msg:
                        self.progress["value"] = msg["progress"]
                elif msg["type"] == "record":
                    r = msg["data"]
                    self.tree.insert("", "end", values=(
                        r.get("Name", ""),
                        r.get("City", ""),
                        r.get("Phone", ""),
                        r.get("Website", ""),
                        r.get("Instagram", ""),
                        r.get("Notes", "")
                    ))
                    self.tree.yview_moveto(1)
                elif msg["type"] == "done":
                    messagebox.showinfo("Complete", "Extraction complete and saved to Excel!")
                    self.reset_ui()
                elif msg["type"] == "error":
                    messagebox.showerror("Error", msg["text"])
                    self.reset_ui()
        except queue.Empty:
            pass
        finally:
            self.root.after(100, self.process_queue)
            
    def reset_ui(self):
        self.is_running = False
        self.start_btn.config(state="normal")
        self.url_entry.config(state="normal")
        self.status_var.set("Status: Ready.")
        self.progress["value"] = 0

    def scrape_thread(self, url):
        config.HEADLESS_MODE = True
        config.MAX_RESULTS = 999999
        config.SCROLL_ROUNDS = 9999
        driver = None
        try:
            self.queue.put({"type": "status", "text": "Initializing browser...", "progress": 5})
            driver = create_driver()
            
            self.queue.put({"type": "status", "text": "Loading search URL...", "progress": 10})
            if not safe_load(driver, url):
                self.queue.put({"type": "error", "text": "Failed to load Google Maps URL."})
                return

            self.queue.put({"type": "status", "text": "Scrolling and gathering link listings...", "progress": 20})
            
            try:
                feed = driver.find_element(By.XPATH, '//div[@role="feed"]')
            except NoSuchElementException:
                self.queue.put({"type": "error", "text": "No business listings found."})
                return

            prev_count = 0
            for scroll_idx in range(1, config.SCROLL_ROUNDS + 1):
                driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", feed)
                time.sleep(config.SCROLL_PAUSE_SEC)
                current = driver.find_elements(By.XPATH, '//a[contains(@href, "/maps/place")]')
                
                self.queue.put({"type": "status", "text": f"Scrolling... Found {len(current)} listings.", "progress": 25})
                
                if len(current) >= config.MAX_RESULTS:
                    break
                if len(current) == prev_count:
                    break
                prev_count = len(current)

            elements = driver.find_elements(By.XPATH, '//a[contains(@href, "/maps/place")]')
            seen, links = set(), []
            for el in elements[: config.MAX_RESULTS]:
                try:
                    name = el.get_attribute("aria-label") or ""
                    link = el.get_attribute("href") or ""
                    if name and link and link not in seen:
                        seen.add(link)
                        links.append({"name": name.strip(), "link": link})
                except Exception:
                    continue
            
            if not links:
                self.queue.put({"type": "error", "text": "No business listings found."})
                return
            
            self.queue.put({"type": "status", "text": f"Found {len(links)} links. Beginning data extraction...", "progress": 30})
            
            results = []
            for idx, entry in enumerate(links, 1):
                try:
                    self.queue.put({"type": "status", "text": f"Extracting {idx}/{len(links)}: {entry['name']}", "progress": 30 + (idx/len(links))*60})
                    
                    driver.get(entry["link"])
                    time.sleep(config.DETAIL_LOAD_TIMEOUT)

                    name = entry["name"]
                    
                    address = _extract_text(driver, '//button[@data-item-id="address"]//div[contains(@class,"fontBodyMedium")]')
                    if not address:
                        address = _extract_text(driver, '//button[contains(@data-item-id,"address")]')
                    city = _extract_city(address)
                    
                    phone = _extract_text(driver, '//button[contains(@data-item-id,"phone")]//div[contains(@class,"fontBodyMedium")]')
                    if not phone:
                        phone = _extract_text(driver, '//button[contains(@data-item-id,"phone")]')
                    if phone:
                        phone_match = re.search(r"[\d\+\-\s\(\)]{7,}", phone)
                        phone = phone_match.group().strip() if phone_match else phone

                    website = ""
                    try:
                        web_el = driver.find_element(By.XPATH, '//a[@data-item-id="authority"]')
                        website = web_el.get_attribute("href") or ""
                    except NoSuchElementException:
                        pass
                    
                    instagram = _find_instagram(driver, website)
                    
                    about = _extract_text(driver, '//div[contains(@class,"WeS02d")]//span')
                    if not about:
                        about = _extract_text(driver, '//div[@class="PYvSYb"]')
                    
                    record = {
                        "Name": name, "City": city, "Instagram": instagram, 
                        "Phone": phone, "Website": website, "About": about, "Notes": ""
                    }
                    results.append(record)
                    self.queue.put({"type": "record", "data": record})
                except Exception as e:
                    logging.error(f"Error extracting {entry['name']}: {traceback.format_exc()}")
            
            self.queue.put({"type": "status", "text": "Saving to Excel...", "progress": 95})
            
            save_to_excel([{
                "Name": r["Name"],
                "City": r["City"],
                "Instagram": r["Instagram"],
                "Phone": r["Phone"],
                "Website": r["Website"],
                "Notes": r["Notes"],
                "About": r["About"],
            } for r in results], "gym_leads.xlsx")
            
            self.queue.put({"type": "done"})
            
        except Exception as e:
            logging.error(traceback.format_exc())
            self.queue.put({"type": "error", "text": str(e)})
        finally:
            if driver:
                driver.quit()

if __name__ == "__main__":
    root = tk.Tk()
    app = ExtractorGUI(root)
    root.mainloop()
