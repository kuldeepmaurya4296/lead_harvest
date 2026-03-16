import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import { User } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
        console.error("RAZORPAY_KEY_SECRET is missing");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Handle Free Access or Standard Payment
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

    if (razorpay_signature === "free_access") {
        await dbConnect();
        await User.findOneAndUpdate(
            { email: (session as any).user.email },
            {
                subscriptionStatus: "active",
                planExpiry: expiryDate
            }
        );
        return NextResponse.json({ success: true });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        await dbConnect();
        await User.findOneAndUpdate(
            { email: (session as any).user.email },
            {
                subscriptionStatus: "active",
                planExpiry: expiryDate
            }
        );
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
    }
}
