"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiXCircle } from "react-icons/hi2";

interface DenyRequestButtonProps {
    requestId: string;
}

export function DenyRequestButton({ requestId }: DenyRequestButtonProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleDeny = async () => {
        setIsPending(true);
        try {
            const response = await fetch("/api/admin/deny-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error denying request:", data.error);
                alert(`Failed to deny request: ${data.error || "Unknown error"}`);
                setIsPending(false);
                return;
            }

            // Refresh the page to show updated status
            router.refresh();
        } catch (error) {
            console.error("Error denying request:", error);
            alert(`Failed to deny request: ${error instanceof Error ? error.message : "Unknown error"}`);
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleDeny}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-red-700 transition hover:border-red-400 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <HiXCircle className="h-4 w-4" />
            {isPending ? "Denying..." : "Deny"}
        </button>
    );
}
