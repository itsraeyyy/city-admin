import { Metadata } from "next";
import Link from "next/link";
import { HiQrCode, HiDocumentArrowUp, HiDocumentText, HiCheckCircle, HiClock } from "react-icons/hi2";
import { listRecentQrRequests, approveAccessRequest } from "@/lib/access";
import { publicEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Admin : Dashboard",
  description: "Monitor QR requests, approve access, and upload documents.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const recentRequests = await listRecentQrRequests(50); // Fetch more to allow filtering

  // Filter: Hide approved requests older than 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const filteredRequests = recentRequests.filter((req) => {
    if (req.status === "pending") return true;
    return new Date(req.created_at) > oneDayAgo;
  }).slice(0, 10); // Show top 10 after filtering

  // Calculate stats
  const pendingCount = recentRequests.filter(r => r.status === "pending").length;
  const approvedCount = recentRequests.filter(r => r.status === "approved").length;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Section */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
          Administrator
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {publicEnv.NEXT_PUBLIC_WOREDA_NAME}
        </h1>
        <p className="mt-1 text-sm text-blue-100 opacity-90">
          Manage access and documents securely.
        </p>
      </section>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase text-slate-400">Pending</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase text-slate-400">Approved</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{approvedCount}</p>
        </div>
      </div>

      {/* Recent Requests */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-900">Recent Requests</h2>
          <span className="text-xs font-medium text-slate-500">
            {filteredRequests.length} visible
          </span>
        </div>

        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">No recent requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <article
                key={request.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900 font-mono">
                        {request.code}
                      </span>
                      {request.status === "approved" && (
                        <HiCheckCircle className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${request.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {request.status}
                  </span>
                </div>

                {request.status === "pending" && (
                  <form action={approveRequestAction} className="pt-2 border-t border-slate-50">
                    <input type="hidden" name="requestId" value={request.id} />
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition active:scale-95 hover:bg-emerald-700"
                    >
                      <HiCheckCircle className="h-5 w-5" />
                      Approve Access
                    </button>
                  </form>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 px-2">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/upload"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 transition active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <HiDocumentArrowUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Upload Document</h3>
              <p className="text-xs text-slate-500">Add new files</p>
            </div>
          </Link>
          <Link
            href="/admin/documents"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 transition active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HiDocumentText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">View Documents</h3>
              <p className="text-xs text-slate-500">Manage uploads</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

async function approveRequestAction(formData: FormData) {
  "use server";
  const requestId = formData.get("requestId")?.toString();
  if (!requestId) {
    throw new Error("Request ID is required.");
  }

  await approveAccessRequest(requestId);
}


