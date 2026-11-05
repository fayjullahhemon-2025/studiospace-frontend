"use client";

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { signIn } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg role="img" aria-label="Google" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.29V6.62H1.29a11.9 11.9 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

type Status = {
  kind: "idle" | "pending" | "success" | "error";
  message?: string;
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [googlePending, setGooglePending] = useState(false);
  const pending = status.kind === "pending" || googlePending;

  async function handleGoogleSignIn() {
    if (googlePending) {
      return;
    }
    setGooglePending(true);
    setStatus({ kind: "pending" });

    let errorMessage: string | null = null;
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (error) {
        errorMessage = error.message || "Google sign-in failed";
      } else {
        toast.success("Signed in with Google! Welcome back.");
      }
    } catch {
      errorMessage = "Google sign-in failed";
    }

    if (errorMessage) {
      setStatus({ kind: "error", message: errorMessage });
      toast.error(errorMessage);
    }
    setGooglePending(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setStatus({ kind: "pending" });

    const { data: resData, error } = await signIn.email({
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
      rememberMe: data.rememberMe === "on",
    });

    if (error) {
      const signInError = error.message || "Sign-in failed";
      setStatus({ kind: "error", message: signInError });
      toast.error(signInError);
      return;
    }

    setStatus({ kind: "success", message: "Welcome back! You are signed in." });
    toast.success("Welcome back! You are signed in.");
    window.setTimeout(() => {
      window.location.assign("/");
    }, 700);

    return resData;
  }

  return (
    <div className="flex w-full flex-col">
      <p className="mb-10 flex justify-end text-xs text-muted-foreground">
        Don’t have an account?{" "}
        <a
          href="/signup"
          className="ml-1 inline-flex items-center gap-1 font-semibold text-brand hover:underline"
        >
          Create an atelier profile
        </a>
      </p>

      <p className="text-[11px] font-bold tracking-[0.2em] text-brand uppercase">
        Member Authentication
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        Welcome Back
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in to access your saved studios, call sheets, and booking history.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={pending}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
        >
          <GoogleIcon />
          {googlePending ? "Redirecting to Google…" : "Continue with Google"}
        </button>
      </div>

      <div className="my-7 flex items-center gap-4 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        Or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-wide text-foreground"
            >
              Email address
            </label>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="size-3" /> Studio ID verified
            </span>
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="producer@inkfolkstudio.com"
              className="h-11 w-full rounded-lg border border-input bg-transparent pr-3.5 pl-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wide text-foreground"
            >
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-[11px] font-medium text-brand hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="h-11 w-full rounded-lg border border-input bg-transparent px-3.5 pr-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              name="rememberMe"
              defaultChecked
              className="size-3.5 shrink-0 rounded-sm accent-brand"
            />
            Remember me for 30 days
          </label>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Lock className="size-3" /> 256-bit encryption
          </span>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in to StudioSpace"}
          <ArrowRight className="size-4" />
        </button>

        {status.kind === "success" ? (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-4 shrink-0" /> {status.message}
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            <Lock className="size-4 shrink-0" /> {status.message}
          </p>
        ) : null}
      </form>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
          <Building2 className="size-4 text-muted-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">Hosting an atelier?</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            Access to host dashboard or list your space
          </p>
        </div>
        <a
          href="/host-portal"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Host Portal <ArrowRight className="size-3" />
        </a>
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[11px] text-muted-foreground">
        <p>© 2025 StudioSpace Inc. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:text-foreground">
            Terms of Service
          </a>
          <a href="/security" className="hover:text-foreground">
            Security
          </a>
        </nav>
      </footer>
    </div>
  );
}
