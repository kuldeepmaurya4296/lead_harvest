import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        await dbConnect();

        // 1. Find user and check OTP
        const user = await User.findOne({ email }).select("+otp +otpExpiry");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }

        if (new Date() > user.otpExpiry) {
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        // 2. Mark as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: "Account verified successfully. You can now login.", success: true });
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
