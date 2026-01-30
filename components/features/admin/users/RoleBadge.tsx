import React from "react";
import type { UserRole } from "./types";

type RoleBadgeProps = {
  role: UserRole;
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 ring-1 ring-zinc-200">
      {role}
    </span>
  );
}
