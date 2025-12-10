"use client";

import { useState, useEffect } from "react";

interface TimeInput12HourProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
}

export function TimeInput12Hour({ value, onChange, id, className, placeholder }: TimeInput12HourProps) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState<"ጥዋት" | "ከሰአት">("ጥዋት");

  // Parse value when it changes from outside
  useEffect(() => {
    if (value) {
      // Try to parse 24-hour format
      const match24 = value.match(/^(\d{2}):(\d{2})$/);
      if (match24) {
        const [, h, m] = match24;
        const hour24 = parseInt(h, 10);
        const periodValue = hour24 >= 12 ? "ከሰአት" : "ጥዋት";
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        setHours(hour12.toString());
        setMinutes(m);
        setPeriod(periodValue);
        return;
      }
      
      // Try to parse 12-hour format with Amharic
      const match12 = value.match(/(\d{1,2}):(\d{2})\s*(ጥዋት|ከሰአት)/);
      if (match12) {
        const [, h, m, p] = match12;
        setHours(h);
        setMinutes(m);
        setPeriod(p as "ጥዋት" | "ከሰአት");
        return;
      }
    } else {
      setHours("");
      setMinutes("");
      setPeriod("ጥዋት");
    }
  }, [value]);

  const updateTime = (newHours: string, newMinutes: string, newPeriod: "ጥዋት" | "ከሰአት") => {
    if (!newHours || !newMinutes) {
      onChange("");
      return;
    }

    const h = parseInt(newHours, 10);
    const m = parseInt(newMinutes, 10);

    if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) {
      onChange("");
      return;
    }

    // Convert to 24-hour format
    let hour24 = h;
    if (newPeriod === "ከሰአት") {
      hour24 = h === 12 ? 12 : h + 12;
    } else {
      hour24 = h === 12 ? 0 : h;
    }

    const time24 = `${hour24.toString().padStart(2, "0")}:${newMinutes.padStart(2, "0")}`;
    onChange(time24);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val === "" || (parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12)) {
      setHours(val);
      if (val && minutes) {
        updateTime(val, minutes, period);
      } else {
        onChange("");
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val === "" || (parseInt(val, 10) >= 0 && parseInt(val, 10) <= 59)) {
      const padded = val.length === 1 ? val : val.slice(0, 2);
      setMinutes(padded);
      if (hours && padded) {
        updateTime(hours, padded, period);
      } else {
        onChange("");
      }
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as "ጥዋት" | "ከሰአት";
    setPeriod(newPeriod);
    updateTime(hours, minutes, newPeriod);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="flex items-center gap-1 flex-1">
        <input
          type="text"
          id={id}
          value={hours}
          onChange={handleHoursChange}
          placeholder="12"
          maxLength={2}
          className="w-12 rounded-lg border border-slate-300 px-2 py-3 text-center text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all"
        />
        <span className="text-slate-600 font-semibold">:</span>
        <input
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          placeholder="00"
          maxLength={2}
          className="w-12 rounded-lg border border-slate-300 px-2 py-3 text-center text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all"
        />
      </div>
      <select
        value={period}
        onChange={handlePeriodChange}
        className="rounded-lg border border-slate-300 px-3 py-3 text-slate-900 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 outline-none transition-all bg-white"
      >
        <option value="ጥዋት">ጥዋት</option>
        <option value="ከሰአት">ከሰአት</option>
      </select>
    </div>
  );
}

