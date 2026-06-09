"use client";

import type { ReactNode } from "react";

type TrackOnClickProps = {
  event: string;
  payload?: Record<string, string | number | boolean>;
  children: ReactNode;
  className?: string;
  href?: string;
  download?: boolean;
};

export function TrackOnClick({
  event,
  payload,
  children,
  className,
  href,
  download,
}: TrackOnClickProps) {
  return (
    <a
      href={href}
      download={download}
      className={className}
      onClick={() => {
        console.log("Track event:", event, payload);
      }}
    >
      {children}
    </a>
  );
}
