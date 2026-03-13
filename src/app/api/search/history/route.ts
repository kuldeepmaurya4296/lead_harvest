import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Search } from "@/models";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const history = await Search.find({ userId: session.user.id })
            .select('query model leadCount createdAt')
            .sort({ createdAt: -1 });

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
