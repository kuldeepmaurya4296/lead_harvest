import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { User } from "@/models";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { name, email, contactNo, password } = await req.json();

        if (!name || !email || !contactNo || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        await dbConnect();

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ error: "User already exists. Please login." }, { status: 400 });
            } else {
                // User exists but not verified - resend OTP
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

                existingUser.otp = otpCode;
                existingUser.otpExpiry = otpExpiry;
                await existingUser.save();
                await sendOTP(email, otpCode);
                return NextResponse.json({ message: "Verification code resent." });
            }
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // 4. Create User
        await User.create({
            name,
            email,
            password: hashedPassword,
            contactNo,
            otp: otpCode,
            otpExpiry,
            isVerified: false,
        });

        // 5. Send Email
        await sendOTP(email, otpCode);

        return NextResponse.json({ message: "Verification OTP sent to your email." }, { status: 201 });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: error.message || "Failed to create account" }, { status: 500 });
    }
}
