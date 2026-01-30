"use client";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  placeholder?: string;
  onChange: (date: Date | null, dateString: string) => void;
}

export default function DatePicker({ placeholder, onChange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <ReactDatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        setStartDate(date);
        onChange(date, date ? date.toISOString().split("T")[0] : "");
      }}
      placeholderText={placeholder}
      className="w-full border px-3 py-2 rounded dark:bg-dark-900"
      dateFormat="yyyy-MM-dd"
    />
  );
}
