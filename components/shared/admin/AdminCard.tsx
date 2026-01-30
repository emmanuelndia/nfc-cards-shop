import React from "react";

type AdminCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AdminCard({ children, className = "" }: AdminCardProps) {
  return (
    <div className={`rounded-3xl border border-zinc-200 bg-white shadow-sm ${className}`.trim()}>
      {children}
    </div>
  );
}
