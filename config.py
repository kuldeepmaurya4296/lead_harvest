import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ═══════════════════════════════════════════════════════════════════════
#  Scraping Settings
# ═══════════════════════════════════════════════════════════════════════
HEADLESS_MODE = os.getenv("HEADLESS_MODE", "False").lower() == "true"
MAX_RESULTS = int(os.getenv("MAX_RESULTS", 999999))
SCROLL_ROUNDS = int(os.getenv("SCROLL_ROUNDS", 9999))
SCROLL_PAUSE_SEC = float(os.getenv("SCROLL_PAUSE_SEC", 2.5))
PAGE_LOAD_TIMEOUT = int(os.getenv("PAGE_LOAD_TIMEOUT", 30))
DETAIL_LOAD_TIMEOUT = int(os.getenv("DETAIL_LOAD_TIMEOUT", 5))
MAX_RETRIES = 3
RETRY_DELAY_SEC = 2

# ═══════════════════════════════════════════════════════════════════════
#  Browser Settings
# ═══════════════════════════════════════════════════════════════════════
WINDOW_WIDTH = int(os.getenv("WINDOW_WIDTH", 1386))
WINDOW_HEIGHT = int(os.getenv("WINDOW_HEIGHT", 730))

# Vercel/Serverless Settings
BROWSERLESS_TOKEN = os.getenv("BROWSERLESS_TOKEN", "") # Set this in Vercel Env Vars
BROWSERLESS_URL = f"wss://chrome.browserless.io?token={BROWSERLESS_TOKEN}"

# ═══════════════════════════════════════════════════════════════════════
#  File & Path Settings
# ═══════════════════════════════════════════════════════════════════════
OUTPUT_FILE = os.getenv("OUTPUT_FILE", "gym_leads.xlsx")
EXCEL_OUTPUT_FILE = OUTPUT_FILE
LOG_FILE = os.getenv("LOG_FILE", "lead_extractor.log")

# ═══════════════════════════════════════════════════════════════════════
#  Data & Export Settings
# ═══════════════════════════════════════════════════════════════════════
COLUMNS = ["Name", "City", "Instagram", "Phone", "Website", "Notes", "About"]

# ═══════════════════════════════════════════════════════════════════════
#  Google Sheets Settings (Optional)
# ═══════════════════════════════════════════════════════════════════════
SERVICE_ACCOUNT_FILE = "service_account.json"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# ═══════════════════════════════════════════════════════════════════════
#  Backend Settings
# ═══════════════════════════════════════════════════════════════════════
BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))
