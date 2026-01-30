import React from "react";

type AdminSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AdminSection({ children, className = "" }: AdminSectionProps) {
  return <section className={`space-y-6 ${className}`.trim()}>{children}</section>;
}
