"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { signIn, signOut, signUp } from "@/lib/auth-client";

const DEFAULT_AVATAR_PREVIEW =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";

const passwordRules = [
  {
    key: "uppercase",
    label: "1+ uppercase",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: "lowercase",
    label: "1+ lowercase",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: "length",
    label: "Minimum 6 characters",
    test: (value: string) => value.length >= 6,
  },
] as const;

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

export function SignupForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [googlePending, setGooglePending] = useState(false);
  const pending = status.kind === "pending";

  async function handleGoogleSignUp() {
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
        errorMessage = error.message || "Google sign-up failed";
      }
    } catch {
      errorMessage = "Google sign-up failed";
    }

    if (errorMessage) {
      setStatus({ kind: "error", message: errorMessage });
    }
    setGooglePending(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setStatus({ kind: "pending" });
    console.log(data);
    const { data: resData, error } = await signUp.email({
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
      name: String(data.fullName ?? ""),
      image: data.photoUrl ? String(data.photoUrl) : undefined,
      callbackURL: "/",
    });
    console.log(resData, error);

    if (error) {
      setStatus({ kind: "error", message: error.message || "Signup failed" });
      return;
    }

    await signOut();
    setStatus({
      kind: "success",
      message: "Account created! Redirecting you to sign in…",
    });
    window.setTimeout(() => {
      window.location.assign("/login");
    }, 700);
  }

  return (
    <div className="flex w-full flex-col">
      <p className="mb-10 flex justify-end text-xs text-muted-foreground">
        Already a member?{" "}
        <a
          href="/login"
          className="ml-1 inline-flex items-center gap-1 font-semibold text-brand hover:underline"
        >
          Sign In <ArrowRight className="size-3" />
        </a>
      </p>

      <p className="text-[11px] font-bold tracking-[0.2em] text-brand uppercase">
        Creator Registration
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        Create Your Account
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Get started with StudioSpace today and unlock global access.
      </p>

      <div className="  mt-8 grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={status.kind === "pending"}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
        >
          <GoogleIcon />
          {googlePending ? "Redirecting to Google…" : "Google"}
        </button>
      </div>

      <div className="my-7 flex items-center gap-4 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        Or register with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="fullName"
              className="text-xs font-semibold tracking-wide text-foreground"
            >
              Full Name
            </label>
            <span className="text-[11px] text-muted-foreground">Required</span>
          </div>
          <div className="relative">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Elena Rostova"
              className="h-11 w-full rounded-lg border border-input bg-transparent px-3.5 pr-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
            />
            <User className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-wide text-foreground"
            >
              Email Address
            </label>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="size-3" /> Encrypted
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
              placeholder="elena.rostova@atelier-productions.com"
              className="h-11 w-full rounded-lg border border-input bg-transparent pr-3.5 pl-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="photoUrl"
              className="text-xs font-semibold tracking-wide text-foreground"
            >
              Profile Photo URL
            </label>
            <span className="text-[11px] text-muted-foreground">
              Optional avatar
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted bg-cover bg-center"
              style={
                photoUrl.trim()
                  ? { backgroundImage: `url(${photoUrl.trim()})` }
                  : undefined
              }
            />
            <input
              id="photoUrl"
              name="photoUrl"
              type="url"
              placeholder={DEFAULT_AVATAR_PREVIEW}
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-transparent px-3.5 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
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
            <span className="text-[11px] text-muted-foreground">
              6–70 characters
            </span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              maxLength={70}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-transparent pr-10 pl-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
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
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {passwordRules.map((rule) => {
              const satisfied = rule.test(password);
              return (
                <span
                  key={rule.key}
                  className={`flex items-center gap-1.5 text-[11px] ${
                    satisfied ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex size-3.5 items-center justify-center rounded-sm border ${
                      satisfied
                        ? "border-brand bg-brand text-white"
                        : "border-input"
                    }`}
                  >
                    {satisfied ? <Check className="size-2.5" /> : null}
                  </span>
                  {rule.label}
                </span>
              );
            })}
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 size-3.5 shrink-0 rounded-sm accent-brand"
          />
          <span>
            I agree to the StudioSpace{" "}
            <a href="/terms-of-service" className="text-foreground underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-foreground underline">
              Privacy Policy
            </a>
            , including community creator guidelines.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {pending ? "Creating Account…" : "Create Account"}
          <ArrowRight className="size-4" />
        </button>

        {status.kind === "success" ? (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-4 shrink-0" /> {status.message}
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            <Sparkles className="size-4 shrink-0" /> {status.message}
          </p>
        ) : null}
      </form>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3.5">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5 text-brand" />
            Want to list your studio space?
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            Reserve prepaid seat hours
          </p>
        </div>
        <a
          href="/host-signup"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Host Signup <ArrowRight className="size-3" />
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
          <a href="/trust-and-safety" className="hover:text-foreground">
            Trust &amp; Safety
          </a>
        </nav>
      </footer>
    </div>
  );
}
