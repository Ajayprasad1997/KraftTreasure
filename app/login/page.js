
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("admin@krafttreasure.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    // Demo only: replace with real authentication.
    router.push("/admin/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden flex-col justify-between bg-[#2F2824] p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-2xl">
            ✳
          </span>

          <span className="text-xl font-extrabold">
            KraftTreasure
          </span>
        </Link>

        <div>
          <div className="mb-5 text-sm font-semibold uppercase tracking-[.2em] text-[#DCA58F]">
            Thoughtfully crafted. Beautifully managed.
          </div>

          <h1 className="max-w-lg text-5xl font-bold leading-tight tracking-tight">
            Your store, all in one{" "}
            <span className="text-[#DCA58F]">beautiful</span> place.
          </h1>

          <p className="mt-5 max-w-md leading-7 text-stone-300">
            Manage products, orders, customers, and the little
            details that make your business special.
          </p>
        </div>

        <div className="text-xs text-stone-400">
          © 2026 KraftTreasure. Admin access only.
        </div>
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[410px]">
          {/* Mobile branding */}
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 text-sm font-semibold text-brand lg:hidden"
          >
            <span className="text-xl">✳</span>
            KraftTreasure
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-light text-brand">
              <LockKeyhole size={22} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Sign in to your KraftTreasure admin account.
            </p>
          </div>

          {/* Error or information message */}
          {message && (
            <div
              role="alert"
              className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-stone-800"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input mt-2 w-full"
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-stone-800"
              >
                Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full pr-11"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShow((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Please contact your store administrator to reset your password."
                  )
                }
                className="text-xs font-semibold text-brand hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              Sign in
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs leading-5 text-stone-400">
            Demo login only. Secure server-side authentication is
            required before using this admin panel in production.
          </p>
        </div>
      </div>
    </div>
  );
}

