"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function AuthBadge() {
  const { user, initialized } = useAuthStore();

  if (!initialized) return null;

  return (
    <>
      {!user ? (
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-medium text-black backdrop-blur transition hover:bg-white"
        >
          Sign in
        </Link>
      ) : (
        <div className="flex items-center gap-3">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Avatar"
              className="size-9 rounded-full ring-1 ring-black/10"
            />
          )}
          <button
            onClick={() => signOut(auth)}
            className="text-sm font-medium text-black/60 hover:text-black transition"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
