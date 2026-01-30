import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-3xl border border-zinc-200 bg-white shadow-sm ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`border-b border-zinc-200 px-6 py-5 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`p-6 ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-5 ${className}`.trim()}>{children}</div>;
}
