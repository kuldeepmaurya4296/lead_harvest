import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User, Search } from "@/models";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const activeSubs = await User.countDocuments({ role: 'user', subscriptionStatus: 'active' });
        const totalSearches = await Search.countDocuments();
        const recentUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(10);

        return NextResponse.json({
            totalUsers,
            activeSubs,
            totalSearches,
            users: recentUsers
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
