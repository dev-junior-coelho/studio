"use client";

import { cn } from "@/lib/utils";

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={cn("w-full max-w-none px-4 sm:px-6 lg:px-8 pt-6 pb-24 animate-in fade-in duration-500", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between select-none">
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight leading-tight text-slate-800 select-all">{title}</h1>
          {description ? <p className="text-xs font-semibold text-slate-400 mt-1 select-all">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      <div className={cn("mt-6", contentClassName)}>{children}</div>
    </div>
  );
}
