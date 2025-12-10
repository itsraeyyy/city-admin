"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { HiCalendar, HiClock, HiUser, HiCheckCircle, HiXCircle, HiArrowPath, HiDocumentText } from "react-icons/hi2";
import { parseEthiopianDate, getEthiopianDateWithMonthName } from "@/lib/ethiopianCalendar";
import { formatTime12Hour } from "@/lib/timeFormat";

interface AppointmentStatus {
  id: string;
  unique_code: string;
  requester_name: string;
  requester_email?: string;
  requester_phone?: string;
  reason: string;
  requested_date_ethiopian: string;
  requested_time?: string;
  status: "pending" | "accepted" | "rejected" | "rescheduled";
  admin_reason?: string;
  rescheduled_date_ethiopian?: string;
  rescheduled_time?: string;
  created_at: string;
  updated_at: string;
}

export default function AppointmentStatusPage() {
  const t = useTranslations('appointmentStatus');
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  
  const [appointment, setAppointment] = useState<AppointmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState(code);

  const fetchAppointment = async (appointmentCode: string) => {
    if (!appointmentCode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/appointments/status?code=${appointmentCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('failedToFetch'));
      }

      setAppointment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorOccurred'));
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchAppointment(code);
    } else {
      setLoading(false);
    }
  }, [code]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      fetchAppointment(inputCode.trim());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <HiCheckCircle className="w-6 h-6 text-green-600" />;
      case "rejected":
        return <HiXCircle className="w-6 h-6 text-red-600" />;
      case "rescheduled":
        return <HiArrowPath className="w-6 h-6 text-yellow-600" />;
      default:
        return <HiClock className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return t('statusAccepted');
      case "rejected":
        return t('statusRejected');
      case "rescheduled":
        return t('statusRescheduled');
      default:
        return t('statusPending');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 border-green-200 text-green-800";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-800";
      case "rescheduled":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-24 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-2xl border border-slate-200">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t('pageTitle')}
            </h1>
            <p className="text-slate-600">
              {t('pageDescription')}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder={t('codePlaceholder')}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all font-mono uppercase"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3557c7] hover:shadow-lg"
              >
                {t('checkButton')}
              </button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4169E1]"></div>
              <p className="mt-4 text-slate-600">{t('loading')}</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Appointment Details */}
          {appointment && !loading && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className={`rounded-xl p-4 border-2 ${getStatusColor(appointment.status)}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <p className="font-semibold text-lg">{t('status')}: {getStatusText(appointment.status)}</p>
                    <p className="text-sm opacity-80">{t('code')}: {appointment.unique_code}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('appointmentDetails')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <HiUser className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">{t('name')}</p>
                        <p className="font-medium text-slate-900">{appointment.requester_name}</p>
                      </div>
                    </div>

                    {appointment.requester_email && (
                      <div className="flex items-start gap-3">
                        <HiUser className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">{t('email')}</p>
                          <p className="font-medium text-slate-900">{appointment.requester_email}</p>
                        </div>
                      </div>
                    )}

                    {appointment.requester_phone && (
                      <div className="flex items-start gap-3">
                        <HiUser className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">{t('phone')}</p>
                          <p className="font-medium text-slate-900">{appointment.requester_phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <HiDocumentText className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">{t('reason')}</p>
                        <p className="font-medium text-slate-900">{appointment.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <HiCalendar className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">{t('requestedDate')}</p>
                        <p className="font-medium text-slate-900">
                          {getEthiopianDateWithMonthName(parseEthiopianDate(appointment.requested_date_ethiopian))}
                        </p>
                      </div>
                    </div>

                    {appointment.requested_time && (
                      <div className="flex items-start gap-3">
                        <HiClock className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">{t('requestedTime')}</p>
                          <p className="font-medium text-slate-900">{formatTime12Hour(appointment.requested_time)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Response */}
                {(appointment.status !== "pending" || appointment.admin_reason) && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{t('adminResponse')}</h4>
                    {appointment.status === "rescheduled" && appointment.rescheduled_date_ethiopian && (
                      <div className="mb-2">
                        <p className="text-sm text-slate-600">
                          <strong>{t('rescheduledDate')}</strong>{" "}
                          {getEthiopianDateWithMonthName(parseEthiopianDate(appointment.rescheduled_date_ethiopian))}
                        </p>
                        {appointment.rescheduled_time && (
                          <p className="text-sm text-slate-600">
                            <strong>{t('rescheduledTime')}</strong> {formatTime12Hour(appointment.rescheduled_time)}
                          </p>
                        )}
                      </div>
                    )}
                    {appointment.admin_reason && (
                      <p className="text-sm text-slate-700">{appointment.admin_reason}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Code Entered */}
          {!appointment && !loading && !error && !code && (
            <div className="text-center py-12 text-slate-500">
              <p>{t('noCodeEntered')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

