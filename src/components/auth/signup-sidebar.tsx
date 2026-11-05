"use client";

import {
  Building2,
  Camera,
  MapPin,
  Quote,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

const starSlots = ["one", "two", "three", "four", "five"];

type AuthReview = {
  id?: string | number;
  quote?: string;
  text?: string;
  message?: string;
  author?: string;
  name?: string;
  role?: string;
  title?: string;
  rating?: number;
  verified?: boolean;

  image_url?: string;
};

function normalizeReviews(payload: unknown): AuthReview[] {
  const list = Array.isArray(payload)
    ? payload
    : typeof payload === "object" &&
        payload !== null &&
        Array.isArray((payload as { reviews?: unknown }).reviews)
      ? (payload as { reviews: unknown[] }).reviews
      : [];
  return list.filter(
    (item): item is AuthReview => typeof item === "object" && item !== null,
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "S";
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-brand">
      {starSlots.map((slot, index) => (
        <Star
          key={slot}
          className={
            index < Math.round(rating)
              ? "size-3 fill-brand"
              : "size-3 text-white/25"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: AuthReview }) {
  const quote = review.quote ?? review.text ?? review.message ?? "";
  const author = review.author ?? review.name ?? "StudioSpace Creator";
  const role = review.role ?? review.title ?? "Verified Creator";
  const rating = review.rating ?? 5;
  const avatar = review.image_url;

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ReviewStars rating={rating} />
          <span className="text-xs font-medium text-white/70">
            {rating.toFixed(1)}
          </span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/60 uppercase">
          {review.verified === false ? "Creator" : "Verified Creator"}
        </span>
      </div>
      <p className="mt-4 flex gap-2 text-sm leading-relaxed text-white/80">
        <Quote className="mt-0.5 size-3.5 shrink-0 fill-brand text-brand" />
        <span>{quote}</span>
      </p>
      <div className="mt-4 flex items-center gap-3">
        {avatar ? (
          <Image
            unoptimized
            src={avatar}
            alt={author}
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
            {initialsOf(author)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{author}</p>
          <p className="truncate text-xs text-white/50">{role}</p>
        </div>
      </div>
    </li>
  );
}

export function SignupSidebar() {
  const [reviews, setReviews] = useState<AuthReview[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth-reviews`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload: unknown = await response.json();
        if (!cancelled) {
          setReviews(normalizeReviews(payload));
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error ? cause.message : "Unable to load reviews",
          );
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  let reviewsContent: ReactNode = null;
  if (reviews === null && !error) {
    reviewsContent = (
      <div className="flex flex-col gap-3" aria-hidden>
        <span className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
        <span className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
        <span className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  } else if (error) {
    reviewsContent = (
      <p className="text-sm text-white/50">
        Couldn’t load creator reviews: {error}
      </p>
    );
  } else if (reviews && reviews.length === 0) {
    reviewsContent = (
      <p className="text-sm text-white/50">
        No creator reviews yet — be the first to join.
      </p>
    );
  } else if (reviews) {
    reviewsContent = (
      <ul className="flex flex-col gap-4">
        {reviews.map((review, index) => (
          <ReviewCard
            key={review.id ?? `${review.author ?? "review"}-${index}`}
            review={review}
          />
        ))}
      </ul>
    );
  }

  return (
    <aside className="relative hidden w-[460px] shrink-0 flex-col justify-between overflow-hidden bg-[#0b0a08] p-10 text-white lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_0%_0%,rgba(255,92,26,0.14),transparent_65%),radial-gradient(60%_45%_at_100%_100%,rgba(255,92,26,0.1),transparent_70%)]"
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Camera className="size-4.5 text-brand" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em]">
              STUDIOSPACE
            </p>
            <p className="text-[10px] tracking-wide text-white/45">
              CONVERTING SPACES INTO STAGES
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-brand uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-brand" />
          Live Community
        </span>
      </div>

      <div className="relative flex flex-col gap-6 py-10">
        <span className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/70">
          <Building2 className="size-3.5 text-brand" />
          Community of 18,000+ Creators
        </span>
        <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight xl:text-5xl">
          Your Creative
          <br />
          Journey{" "}
          <span className="font-display italic text-brand">Starts Here.</span>
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-white/60">
          Join a global collective of directors, spatial designers, and
          photographers discovering spaces that inspire their next production.
        </p>

        <div className="flex flex-col gap-4">{reviewsContent}</div>
      </div>

      <ul className="relative grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-white/60">
        <li className="flex items-center gap-2">
          <Users className="size-3.5 text-brand" />
          <strong className="font-semibold text-white">18,000+</strong> Active
          Creators
        </li>
        <li className="flex items-center gap-2">
          <Zap className="size-3.5 text-brand" />
          Instant Studio Access
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="size-3.5 text-brand" />
          Curated Global Spaces
        </li>
      </ul>
    </aside>
  );
}
