"use client";
import { useState, useEffect } from "react";
import {
  TextField, MenuItem, Stack, FormControl, InputLabel, Select
} from "@mui/material";
import {
  toJalali, jalaliToGregorian, daysInJalaliMonth, jalaliMonths
} from "@/components/erp/helpers";

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

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  const todayJ = toJalali(currentYear, new Date().getMonth() + 1, new Date().getDate());
  for (let y = todayJ.year - 5; y <= todayJ.year + 5; y++) {
    yearOptions.push(y);
  }

  const dayOptions = [];
  const maxDay = daysInJalaliMonth(jYear, jMonth);
  for (let d = 1; d <= maxDay; d++) {
    dayOptions.push(d);
  }

  return (
    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
      <FormControl size="small" sx={{ flex: 1 }}>
        <InputLabel>{label ? `روز (${label})` : "روز"}</InputLabel>
        <Select value={jDay} label={label ? `روز (${label})` : "روز"} onChange={handleDayChange} {...props}>
          {dayOptions.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ flex: 1.5 }}>
        <InputLabel>{label ? `ماه (${label})` : "ماه"}</InputLabel>
        <Select value={jMonth} label={label ? `ماه (${label})` : "ماه"} onChange={handleMonthChange} {...props}>
          {jalaliMonths.map((name, idx) => (
            <MenuItem key={idx + 1} value={idx + 1}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ flex: 1 }}>
        <InputLabel>{label ? `سال (${label})` : "سال"}</InputLabel>
        <Select value={jYear} label={label ? `سال (${label})` : "سال"} onChange={handleYearChange} {...props}>
          {yearOptions.map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
