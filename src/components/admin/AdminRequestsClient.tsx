"use client";

import { useState } from "react";
import { HiQrCode, HiCheckCircle, HiClock, HiTrash } from "react-icons/hi2";
import { ApproveRequestButton } from "@/components/admin/ApproveRequestButton";
import type { QrRequestRecord } from "@/types";

interface AdminRequestsClientProps {
    requests: QrRequestRecord[];
}

export function AdminRequestsClient({ requests }: AdminRequestsClientProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === requests.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(requests.map(r => r.id)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;

        const count = selectedIds.size;
        if (!confirm(`Are you sure you want to delete ${count} request${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const deletePromises = Array.from(selectedIds).map(id =>
                fetch(`/api/admin/delete-qr-request?id=${id}`, { method: "DELETE" })
            );

            await Promise.all(deletePromises);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting requests:", error);
            alert("Failed to delete some requests. Please try again.");
            setIsDeleting(false);
        }
    };

    const handleClearAll = async () => {
        if (requests.length === 0) return;

        if (!confirm(`Are you sure you want to delete ALL ${requests.length} requests? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const deletePromises = requests.map(request =>
                fetch(`/api/admin/delete-qr-request?id=${request.id}`, { method: "DELETE" })
            );

            await Promise.all(deletePromises);
            window.location.reload();
        } catch (error) {
            console.error("Error clearing all requests:", error);
            alert("Failed to clear all requests. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                        <HiQrCode className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">QR Access Requests</h1>
                        <p className="text-sm text-blue-100 opacity-90">
                            Review and approve QR code access requests from users
                        </p>
                    </div>
                </div>
            </section>

            {/* Requests List */}
            <section className="space-y-4 rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Recent Requests</h2>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                            {requests.length} total • {selectedIds.size} selected
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {requests.length > 0 && (
                            <>
                                <button
                                    onClick={toggleSelectAll}
                                    className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                >
                                    {selectedIds.size === requests.length ? 'Deselect All' : 'Select All'}
                                </button>

                                {selectedIds.size > 0 && (
                                    <button
                                        onClick={handleDeleteSelected}
                                        disabled={isDeleting}
                                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                    >
                                        <HiTrash className="h-4 w-4" />
                                        Delete Selected ({selectedIds.size})
                                    </button>
                                )}

                                <button
                                    onClick={handleClearAll}
                                    disabled={isDeleting}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    <HiTrash className="h-4 w-4" />
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {requests.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                            <p className="text-sm text-slate-500">No requests yet.</p>
                        </div>
                    ) : (
                        requests.map((request) => {
                            const isSelected = selectedIds.has(request.id);

                            return (
                                <article
                                    key={request.id}
                                    className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all ${isSelected
                                            ? 'border-blue-300 bg-blue-50/50'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(request.id)}
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-base font-bold text-slate-900 font-mono">
                                                        {request.code}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {request.ip_address ?? "IP Unknown"} • {new Date(request.created_at).toLocaleString()}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${request.status === "approved"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {request.status === "approved" ? (
                                                        <HiCheckCircle className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <HiClock className="h-3.5 w-3.5" />
                                                    )}
                                                    {request.status}
                                                </span>
                                            </div>

                                            {request.status === "pending" && (
                                                <div className="mt-3">
                                                    <ApproveRequestButton requestId={request.id} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
}
