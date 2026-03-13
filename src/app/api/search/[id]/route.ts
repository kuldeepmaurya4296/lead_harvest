import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Search } from "@/models";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const search = await Search.findOne({ _id: id, userId: session.user.id });

        if (!search) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(search);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch search" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const result = await Search.findOneAndDelete({ _id: id, userId: session.user.id });

        if (!result) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
