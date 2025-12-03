"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { HiQrCode, HiClock, HiCheckCircle, HiXCircle, HiArrowRight } from "react-icons/hi2";
import Link from "next/link";
import { motion } from "framer-motion";

interface RequestStatusCheckerProps {
  code: string;
  initialStatus: "pending" | "approved" | "denied" | null;
  initialAccessToken: string | null;
  clientIp: string;
}

export function RequestStatusChecker({
  code,
  initialStatus,
  initialAccessToken,
  clientIp,
}: RequestStatusCheckerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "approved" | "denied" | null>(initialStatus);
  const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken);
  const [isPolling, setIsPolling] = useState(initialStatus === "pending");
  const statusRef = useRef(status);

  // Keep ref in sync with state
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!isPolling || !code) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/request-status?code=${encodeURIComponent(code)}`);
        if (!response.ok) {
          console.error("Failed to check status");
          return;
        }

        const data = await response.json();

        // Use ref to check current status without causing re-renders
        if (data.status && data.status !== statusRef.current) {
          setStatus(data.status);
          setAccessToken(data.accessToken);

          // Stop polling if approved or denied
          if (data.status === "approved" || data.status === "denied") {
            setIsPolling(false);
            // Refresh the page to show updated UI
            setTimeout(() => router.refresh(), 100);
          }
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [code, isPolling, router]);

  const isApproved = status === "approved";
  const isDenied = status === "denied";
  const isPending = status === "pending" || status === null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 rounded-[32px] bg-white p-8 shadow-xl"
        >
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-blue-50">
            <HiQrCode className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
              Temporary Access Flow
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              {isApproved ? "Access Approved" : isDenied ? "Access Denied" : "Requesting Access..."}
            </h1>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[40px] bg-white p-10 shadow-2xl"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isApproved ? "bg-emerald-50" : isDenied ? "bg-red-50" : "bg-amber-50"
              }`}>
              {isApproved ? (
                <HiCheckCircle className="h-7 w-7 text-emerald-600" />
              ) : isDenied ? (
                <HiXCircle className="h-7 w-7 text-red-600" />
              ) : (
                <HiClock className="h-7 w-7 text-amber-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isApproved ? "Access Granted" : isDenied ? "Access Denied" : "Under Review"}
            </h2>
          </div>

          {isApproved ? (
            <>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                Your request has been approved! You now have temporary access to view documents.
                This access is valid for up to two hours.
              </p>
              {accessToken && (
                <div className="mb-8">
                  <Link
                    href={`/documents?token=${accessToken}`}
                    className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    View Documents
                    <HiArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              )}
            </>
          ) : isDenied ? (
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              Your access request has been denied. Please contact an administrator if you believe this is an error.
            </p>
          ) : (
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              The QR code was logged with IP <span className="font-bold text-slate-900">{clientIp}</span>. An administrator will
              review the request shortly.
              {isPolling && (
                <span className="ml-2 inline-block animate-pulse">⏳</span>
              )}
            </p>
          )}

          <div className="grid gap-4 rounded-3xl bg-slate-50 p-6 md:grid-cols-2">
            <div>
              <dt className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <HiQrCode className="h-4 w-4" />
                Request code
              </dt>
              <dd className="font-mono text-lg font-bold text-slate-900">
                {code ?? "Awaiting QR"}
              </dd>
            </div>
            <div>
              <dt className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <HiCheckCircle className="h-4 w-4" />
                Status
              </dt>
              <dd>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${isApproved
                  ? "bg-emerald-100 text-emerald-800"
                  : isDenied
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                  }`}>
                  {status || "pending"}
                </span>
              </dd>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

