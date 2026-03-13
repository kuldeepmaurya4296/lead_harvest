import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Search } from "@/models";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, model, leads } = await req.json();

    if (!query || !leads) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    try {
        await dbConnect();
        const savedSearch = await Search.create({
            userId: session.user.id,
            query,
            model,
            leadCount: leads.length,
            leads: leads.map((l: any) => ({
                name: l.Name,
                city: l.City,
                phone: l.Phone,
                website: l.Website,
                instagram: l.Instagram,
                whatsapp_link: l.whatsapp_link,
                about: l.About,
                address: l.Address,
                notes: l.Notes || "",
                status: "new",
            }))
        });

        return NextResponse.json({ success: true, id: savedSearch._id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save search" }, { status: 500 });
    }
}
