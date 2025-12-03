import { Metadata } from "next";
import { listRecentQrRequests } from "@/lib/access";
import { AdminRequestsClient } from "@/components/admin/AdminRequestsClient";

export const metadata: Metadata = {
  title: "Admin : QR Requests",
  description: "Manage QR access requests.",
};

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const recentRequests = await listRecentQrRequests(100);

  return <AdminRequestsClient requests={recentRequests} />;
}
