import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Check if session.user exists and has subscriptionStatus
    if (session.user.subscriptionStatus !== "active") {
        // Check if it's the admin, admins don't need subscriptions to view dashboards
        if (session.user.role !== "admin") {
            redirect("/checkout");
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {children}
        </div>
    );
}
