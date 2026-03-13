import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { code } = await req.json();

    // In a real app, you'd check this in MongoDB
    const validCoupons: Record<string, number> = {
        "LAUNCH50": 50, // 50% off
        "FREE100": 100, // 100% off (Free access)
    };

    if (validCoupons[code]) {
        return NextResponse.json({
            success: true,
            discount: validCoupons[code],
            newPrice: 100 * (1 - validCoupons[code] / 100)
        });
    }

    return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 400 });
}
