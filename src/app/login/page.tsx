"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Mail,
    Lock,
    User as UserIcon,
    Phone,
    ArrowRight,
    Loader2,
    ShieldCheck,
    Key
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Auth State
    const [view, setView] = useState<"login" | "signup" | "verify">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contactNo: "",
        otp: ""
    });

    // Check if user is already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            if (res?.error) {
                setError(res.error);
                if (res.error.includes("verify")) setView("verify");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post("/api/auth/signup", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                contactNo: formData.contactNo
            });
            setView("verify");
        } catch (err: any) {
            setError(err.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post("/api/auth/verify-otp", {
                email: formData.email,
                otp: formData.otp
            });
            if (data.success) {
                setView("login");
                alert("Verification successful! Please login.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-20">
            {/* Animated Background Rings */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/30 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-gradient-to-tr from-primary-600 to-indigo-600 shadow-2xl shadow-primary-500/20 mb-6"
                    >
                        <ShieldCheck className="text-white" size={40} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        {view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Verification"}
                    </h1>
                    <p className="text-gray-400 font-medium">
                        {view === "login" ? "Sign in to access your dashboard" :
                            view === "signup" ? "Join LeadHarvest to automate your growth" :
                                `Enter the 6-digit code sent to ${formData.email}`}
                    </p>
                </div>

                <div className="glass-card p-10 border-white/5 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {view === "login" && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email Address"
                                            className="input-field pl-12 py-4 bg-white/[0.03] border-white/10"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            className="input-field pl-12 py-4 bg-white/[0.03] border-white/10"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

                                <button
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "SIGN IN"}
                                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"><span className="bg-[#020617] px-4">OR CONTINUE WITH</span></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => signIn("google")}
                                    className="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-white font-black hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                >
                                    <img src="/google.svg" alt="" className="w-5 h-5 invert" />
                                    GOOGLE
                                </button>

                                <p className="text-center text-gray-500 text-xs font-bold">
                                    DON'T HAVE AN ACCOUNT?{" "}
                                    <button type="button" onClick={() => setView("signup")} className="text-primary-400 hover:text-white transition-colors">CREATE ACCOUNT</button>
                                </p>
                            </motion.form>
                        )}

                        {view === "signup" && (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onSubmit={handleSignup}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Full Name"
                                            className="input-field pl-12 py-4 bg-white/[0.03] border-white/10"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email Address"
                                            className="input-field pl-12 py-4 bg-white/[0.03] border-white/10"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <input
                                            name="contactNo"
                                            type="tel"
                                            placeholder="Contact Number"
                                            className="input-field pl-12 py-4 bg-white/[0.03] border-white/10"
                                            value={formData.contactNo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Setup Password"
                                            className="input-field pl-12 py-4 bg-white/[0.03] border-white/10"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

                                <button
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "GET STARTED"}
                                </button>

                                <p className="text-center text-gray-500 text-xs font-bold">
                                    ALREADY HAVE AN ACCOUNT?{" "}
                                    <button type="button" onClick={() => setView("login")} className="text-primary-400 hover:text-white transition-colors">SIGN IN</button>
                                </p>
                            </motion.form>
                        )}

                        {view === "verify" && (
                            <motion.form
                                key="verify"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onSubmit={handleVerifyOTP}
                                className="space-y-8"
                            >
                                <div className="relative flex justify-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center border border-primary-500/30">
                                        <Key className="text-primary-400" size={28} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        name="otp"
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        className="w-full bg-white/[0.03] border-white/10 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.5em] text-white focus:border-primary-500 outline-none transition-all"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                    />
                                    <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-widest">Type the 6-digit code</p>
                                </div>

                                {error && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">{error}</p>}

                                <button
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-primary-600 text-white font-black hover:bg-primary-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "VERIFY ACCOUNT"}
                                </button>

                                <div className="flex justify-between items-center text-xs font-bold px-2">
                                    <button type="button" onClick={() => setView("signup")} className="text-gray-500 hover:text-white">EDIT EMAIL</button>
                                    <button type="button" className="text-primary-400 hover:text-white">RESEND CODE</button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] space-y-2">
                    <p>Secured by Enterprise Grade Cryptography</p>
                    <p>© 2026 LeadHarvest. Scaling your outreach instantly.</p>
                </div>
            </motion.div>
        </div>
    );
}
