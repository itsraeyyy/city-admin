"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { HiCalendar, HiClock, HiUser, HiEnvelope, HiPhone, HiDocumentText, HiCheckCircle, HiArrowRight } from "react-icons/hi2";
import { getCurrentEthiopianDate, formatEthiopianDate, getEthiopianMonthName, parseEthiopianDate, ethiopianToGregorian } from "@/lib/ethiopianCalendar";
import { TimeInput12Hour } from "@/components/TimeInput12Hour";

export default function AppointmentsPage() {
  const t = useTranslations('appointments');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ code: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    reason: "",
    requestedDateEthiopian: formatEthiopianDate(getCurrentEthiopianDate()),
    requestedTime: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Parse Ethiopian date
      const ethDate = parseEthiopianDate(formData.requestedDateEthiopian);
      const gregorianDate = ethiopianToGregorian(ethDate);

      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterName: formData.requesterName,
          requesterEmail: formData.requesterEmail || undefined,
          requesterPhone: formData.requesterPhone || undefined,
          reason: formData.reason,
          requestedDateEthiopian: formData.requestedDateEthiopian,
          requestedDateGregorian: gregorianDate.toISOString().split('T')[0],
          requestedTime: formData.requestedTime || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('failedToCreate'));
      }

      setSuccess({ code: data.uniqueCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-24 pb-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl bg-white p-8 md:p-12 shadow-2xl border border-slate-200">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                <HiCheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {t('requestSubmitted')}
                </h1>
                <p className="text-slate-600">
                  {t('requestSubmittedDescription')}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <p className="text-sm font-medium text-slate-700 mb-2">{t('appointmentCode')}</p>
                <p className="text-2xl font-bold text-blue-600 font-mono">{success.code}</p>
                <p className="text-xs text-slate-500 mt-3">
                  {t('saveCodeMessage')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push(`/appointments/status?code=${success.code}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3557c7] hover:shadow-lg"
                >
                  {t('checkStatus')}
                </button>
                <button
                  onClick={() => {
                    setSuccess(null);
                    setFormData({
                      requesterName: "",
                      requesterEmail: "",
                      requesterPhone: "",
                      reason: "",
                      requestedDateEthiopian: formatEthiopianDate(getCurrentEthiopianDate()),
                      requestedTime: "",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-[#4169E1] hover:text-[#4169E1]"
                >
                  {t('newRequest')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const todayEthiopian = getCurrentEthiopianDate();
  const todayFormatted = formatEthiopianDate(todayEthiopian);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-24 pb-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-2xl border border-slate-200">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {t('requestTitle')}
                </h1>
                <p className="text-slate-600">
                  {t('requestDescription')}
                </p>
              </div>
              <Link
                href="/appointments/status"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#4169E1] bg-white px-6 py-3 text-sm font-semibold text-[#4169E1] transition-all hover:bg-[#4169E1] hover:text-white hover:shadow-lg"
              >
                {t('checkStatusButton')}
                <HiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="requesterName" className="block text-sm font-semibold text-slate-700 mb-2">
                <HiUser className="inline w-4 h-4 mr-1" />
                {t('fullName')}
              </label>
              <input
                type="text"
                id="requesterName"
                required
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all"
                placeholder={t('fullNamePlaceholder')}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="requesterEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                <HiEnvelope className="inline w-4 h-4 mr-1" />
                {t('email')}
              </label>
              <input
                type="email"
                id="requesterEmail"
                value={formData.requesterEmail}
                onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="requesterPhone" className="block text-sm font-semibold text-slate-700 mb-2">
                <HiPhone className="inline w-4 h-4 mr-1" />
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                id="requesterPhone"
                value={formData.requesterPhone}
                onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all"
                placeholder={t('phonePlaceholder')}
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-slate-700 mb-2">
                <HiDocumentText className="inline w-4 h-4 mr-1" />
                {t('reason')}
              </label>
              <textarea
                id="reason"
                required
                rows={4}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all resize-none"
                placeholder={t('reasonPlaceholder')}
              />
            </div>

            {/* Date - Ethiopian Calendar */}
            <div>
              <label htmlFor="requestedDateEthiopian" className="block text-sm font-semibold text-slate-700 mb-2">
                <HiCalendar className="inline w-4 h-4 mr-1" />
                {t('preferredDate')}
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  id="requestedDateEthiopian"
                  required
                  value={formData.requestedDateEthiopian}
                  onChange={(e) => setFormData({ ...formData, requestedDateEthiopian: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all"
                  placeholder={t('datePlaceholder')}
                  pattern="\d{2}/\d{2}/\d{4}"
                />
                <p className="text-xs text-slate-500">
                  {t('dateFormat', { today: `${todayFormatted} - ${getEthiopianMonthName(todayEthiopian.month)} ${todayEthiopian.day}, ${todayEthiopian.year}` })}
                </p>
              </div>
            </div>

            {/* Time */}
            <div>
              <label htmlFor="requestedTime" className="block text-sm font-semibold text-slate-700 mb-2">
                <HiClock className="inline w-4 h-4 mr-1" />
                {t('preferredTime')}
              </label>
              <TimeInput12Hour
                id="requestedTime"
                value={formData.requestedTime}
                onChange={(value) => setFormData({ ...formData, requestedTime: value })}
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#4169E1] px-6 py-4 text-base font-semibold text-white transition-all hover:bg-[#3557c7] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

