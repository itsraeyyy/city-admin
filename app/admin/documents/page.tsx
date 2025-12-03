import { Metadata } from "next";
import { getDocumentsForCurrentWoreda } from "@/lib/uploads";
import { AdminDocumentsClient } from "@/components/admin/AdminDocumentsClient";

export const metadata: Metadata = {
  title: "Admin : View Documents",
  description: "Browse and manage all uploaded documents.",
};


export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const documents = await getDocumentsForCurrentWoreda();

  return <AdminDocumentsClient documents={documents} />;
}
