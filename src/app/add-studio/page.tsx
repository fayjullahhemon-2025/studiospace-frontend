"use client";

import {
  AlertCircle,
  Building2,
  CheckSquare,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
  "Film Stages",
  "Dance Studios",
  "Event Spaces",
] as const;

const AMENITIES_OPTIONS = [
  "Natural Lighting",
  "Cyclorama Wall",
  "Full Grid Rigging",
  "Camera Dolly Tracks",
  "Acoustic Foam Panels",
  "Soundproofing",
  "Green Screen",
  "Professional Lighting Kit",
  "Air Conditioning",
  "High-Speed WiFi",
  "Changing Rooms",
  "Hair & Makeup Station",
  "Kitchenette",
  "Parking Available",
  "24/7 Access",
  "Freight Elevator",
  "Loading Dock",
  "On-site Storage",
  "Backdrop Collection",
  "Prop Wardrobe",
  "Recording Booth",
  "Mixing Console",
  "Grand Piano",
  "Drum Kit",
] as const;

type Category = (typeof CATEGORIES)[number];
type Amenity = (typeof AMENITIES_OPTIONS)[number];

interface FormState {
  title: string;
  category: Category | "";
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  location: string;
  image: string;
  description: string;
  amenities: Amenity[];
}

const INITIAL_FORM: FormState = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  location: "",
  image: "",
  description: "",
  amenities: [],
};

// ─── Field helpers ─────────────────────────────────────────────────────────────

function labelCls() {
  return "block text-xs font-semibold text-foreground mb-1.5";
}
function inputCls(hasPrefix = false) {
  return `h-11 w-full rounded-xl border border-input bg-background ${hasPrefix ? "pl-10 pr-3" : "px-3"} text-sm outline-none transition-shadow focus:border-brand/60 focus:ring-2 focus:ring-brand/20 placeholder:text-muted-foreground/60`;
}
function sectionHeading(label: string) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddStudioPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Auth guard ──
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?callbackUrl=/add-studio");
    }
  }, [session, isPending, router]);

  // ── Field helpers ──
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(amenity: Amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      toast.error("You must be signed in to list a studio.");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit),
      capacity: Number(form.capacity),
      location: form.location.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      amenities: form.amenities,
      ownerEmail: session.user.email,
      ownerName: session.user.name ?? "",
      rating: 0,
      reviewCount: 0,
      featured: false,
    };

    try {
      const token = await getTokenFromClient();
      const res = await fetch("http://localhost:5000/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: { success: boolean; message?: string } = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to create studio listing.");
        return;
      }

      toast.success("🎉 Studio listed successfully! Redirecting…");
      setTimeout(() => {
        router.push("/my-listings");
      }, 1200);
    } catch {
      toast.error("Network error — could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Loading / auth guard state ──
  if (isPending || (!session?.user && !isPending)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-brand" />
          <p className="text-xs font-medium text-muted-foreground">
            Verifying host credentials…
          </p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* ── Page Header ── */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="size-3.5" />
            <span>Host Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            List a New Studio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details below to publish your creative space to the
            StudioSpace marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ══ SECTION 1 — Space Identity ══════════════════════════════════ */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <Building2 className="size-4.5 text-brand" />
              <h2 className="text-base font-bold tracking-tight">
                Space Identity
              </h2>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className={labelCls()}>
                Studio Title
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                maxLength={120}
                placeholder="e.g. Sunlit Cyclorama Loft — SoHo NY"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className={inputCls()}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className={labelCls()}>
                Category
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <select
                id="category"
                required
                value={form.category}
                onChange={(e) =>
                  setField("category", e.target.value as Category)
                }
                className={inputCls()}
              >
                <option value="">— Select a category —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className={labelCls()}>
                Location / Address
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="location"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="e.g. 142 Mercer St, SoHo, New York, NY"
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  className={inputCls(true)}
                />
              </div>
            </div>
          </div>

          {/* ══ SECTION 2 — Pricing & Capacity ══════════════════════════════ */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <DollarSign className="size-4.5 text-brand" />
              <h2 className="text-base font-bold tracking-tight">
                Pricing &amp; Capacity
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Hourly Rate */}
              <div>
                <label htmlFor="hourlyRate" className={labelCls()}>
                  Hourly Rate (USD)
                  <span className="ml-0.5 text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    $
                  </span>
                  <input
                    id="hourlyRate"
                    type="number"
                    required
                    min={5}
                    max={5000}
                    step={1}
                    placeholder="85"
                    value={form.hourlyRate}
                    onChange={(e) => setField("hourlyRate", e.target.value)}
                    className={inputCls(true)}
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label htmlFor="securityDeposit" className={labelCls()}>
                  Security Deposit (USD)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    $
                  </span>
                  <input
                    id="securityDeposit"
                    type="number"
                    min={0}
                    max={10000}
                    step={1}
                    placeholder="250"
                    value={form.securityDeposit}
                    onChange={(e) =>
                      setField("securityDeposit", e.target.value)
                    }
                    className={inputCls(true)}
                  />
                </div>
              </div>

              {/* Max Capacity */}
              <div>
                <label htmlFor="capacity" className={labelCls()}>
                  Max Capacity
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="capacity"
                    type="number"
                    min={1}
                    max={500}
                    step={1}
                    placeholder="12"
                    value={form.capacity}
                    onChange={(e) => setField("capacity", e.target.value)}
                    className={inputCls(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══ SECTION 3 — Media ════════════════════════════════════════════ */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <ImageIcon className="size-4.5 text-brand" />
              <h2 className="text-base font-bold tracking-tight">
                Cover Image
              </h2>
            </div>

            <div>
              <label htmlFor="image" className={labelCls()}>
                Image URL
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <input
                id="image"
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-…"
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
                className={inputCls()}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Paste a direct image URL (Unsplash, your CDN, etc.). Use
                landscape ratio for best results.
              </p>
            </div>

            {/* Live Preview */}
            {form.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                {/* biome-ignore lint/performance/noImgElement: preview only */}
                <img
                  src={form.image}
                  alt="Cover preview"
                  className="aspect-video w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* ══ SECTION 4 — Amenities ════════════════════════════════════════ */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <Wifi className="size-4.5 text-brand" />
              <h2 className="text-base font-bold tracking-tight">Amenities</h2>
            </div>

            {sectionHeading(
              `Select all that apply — ${form.amenities.length} selected`,
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {AMENITIES_OPTIONS.map((amenity) => {
                const checked = form.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all ${checked
                      ? "border-brand/50 bg-brand/8 text-brand shadow-2xs"
                      : "border-border bg-background text-muted-foreground hover:border-brand/30 hover:bg-muted/40 hover:text-foreground"
                      }`}
                  >
                    <CheckSquare
                      className={`size-3.5 shrink-0 ${checked ? "text-brand" : "text-muted-foreground/40"}`}
                    />
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══ SECTION 5 — Description ══════════════════════════════════════ */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <FileText className="size-4.5 text-brand" />
              <h2 className="text-base font-bold tracking-tight">
                Detailed Overview
              </h2>
            </div>

            <label htmlFor="description" className={labelCls()}>
              Description
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              required
              minLength={30}
              maxLength={2000}
              placeholder="Describe your space in detail — lighting conditions, equipment included, what makes it unique, nearby landmarks, parking info, etc."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none transition-shadow focus:border-brand/60 focus:ring-2 focus:ring-brand/20 placeholder:text-muted-foreground/60"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {form.description.length} / 2000
            </p>
          </div>

          {/* ══ SECTION 6 — Host Info (read-only) ═══════════════════════════ */}
          <div className="rounded-2xl border border-border bg-muted/30 p-6 shadow-2xs">
            <div className="mb-4 flex items-center gap-2 text-foreground">
              <AlertCircle className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground">
                Listing will be associated with your account
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="host-name" className={labelCls()}>
                  Host Name
                </label>
                <input
                  id="host-name"
                  type="text"
                  readOnly
                  value={user?.name ?? ""}
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-input bg-muted/50 px-3 text-sm text-muted-foreground outline-none"
                />
              </div>
              <div>
                <label htmlFor="host-email" className={labelCls()}>
                  Host Email
                </label>
                <input
                  id="host-email"
                  type="email"
                  readOnly
                  value={user?.email ?? ""}
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-input bg-muted/50 px-3 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>
          </div>

          {/* ══ Submit Row ════════════════════════════════════════════════════ */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="h-12 w-full rounded-full border border-border bg-muted/40 px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-strong disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Publishing…</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Publish Studio Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
