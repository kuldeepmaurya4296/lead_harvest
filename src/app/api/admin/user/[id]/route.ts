import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User, Search } from "@/models";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(id);
        const searches = await Search.find({ userId: id }).sort({ createdAt: -1 });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user, searches });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}
