"use client";
import { useState, useEffect, useRef } from "react";
import {
  toJalali, jalaliToGregorian, daysInJalaliMonth, jalaliMonths
} from "@/components/erp/helpers";

const selectStyle = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  fontFamily: "Vazirmatn, sans-serif",
  background: "#fff",
  color: "#1a1a2e",
  border: "1px solid #d1d5db",
  borderRadius: "var(--radius-md)",
  outline: "none",
  cursor: "pointer",
  transition: "border-color 0.15s, box-shadow 0.15s",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
};

export default function JalaliDatePicker({ value, onChange, label, ...props }) {
  const [jYear, setJYear] = useState(1403);
  const [jMonth, setJMonth] = useState(1);
  const [jDay, setJDay] = useState(1);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
        setJYear(j.year);
        setJMonth(j.month);
        setJDay(Math.min(j.day, daysInJalaliMonth(j.year, j.month)));
      }
    } else {
      const today = new Date();
      const j = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setJYear(j.year);
      setJMonth(j.month);
      setJDay(j.day);
    }
  }, [value]);

  const emitChange = (y, m, d) => {
    const greg = jalaliToGregorian(y, m, d);
    const iso = `${greg.year}-${String(greg.month).padStart(2, "0")}-${String(greg.day).padStart(2, "0")}`;
    onChange(iso);
  };

  const handleYearChange = (e) => {
    const y = parseInt(e.target.value);
    setJYear(y);
    const maxDay = daysInJalaliMonth(y, jMonth);
    const d = Math.min(jDay, maxDay);
    setJDay(d);
    emitChange(y, jMonth, d);
  };

  const handleMonthChange = (e) => {
    const m = parseInt(e.target.value);
    setJMonth(m);
    const maxDay = daysInJalaliMonth(jYear, m);
    const d = Math.min(jDay, maxDay);
    setJDay(d);
    emitChange(jYear, m, d);
  };

  const handleDayChange = (e) => {
    const d = parseInt(e.target.value);
    setJDay(d);
    emitChange(jYear, jMonth, d);
  };

  const currentYear = new Date().getFullYear();
  const todayJ = toJalali(currentYear, new Date().getMonth() + 1, new Date().getDate());
  const yearOptions = [];
  for (let y = todayJ.year - 5; y <= todayJ.year + 5; y++) {
    yearOptions.push(y);
  }

  const maxDay = daysInJalaliMonth(jYear, jMonth);
  const dayOptions = [];
  for (let d = 1; d <= maxDay; d++) {
    dayOptions.push(d);
  }

  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      <div style={{ flex: 1 }}>
        <select value={jYear} onChange={handleYearChange} style={selectStyle} {...props}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1.5 }}>
        <select value={jMonth} onChange={handleMonthChange} style={selectStyle} {...props}>
          {jalaliMonths.map((name, idx) => (
            <option key={idx + 1} value={idx + 1}>{name}</option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <select value={jDay} onChange={handleDayChange} style={selectStyle} {...props}>
          {dayOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
