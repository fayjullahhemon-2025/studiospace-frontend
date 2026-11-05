"use client";

import {
  ArrowLeft,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  Heart,
  Maximize2,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { BookingModal } from "@/components/studios/BookingModal";
import { useSession } from "@/lib/auth-client";

export type StudioDetail = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  images?: string[];
  description: string;
  squareFeet?: number;
  ceilingHeight?: string;
  capacity?: number;
  ownerEmail?: string;
  ownerName?: string;
  createdAt?: string | Date;
  host?: {
    name: string;
    avatar: string;
    responseRate: string;
    responseTime: string;
    verified: boolean;
    joined: string;
    bio: string;
  };
  amenities?: (string | { icon: string; name: string })[];
  rules?: string[];
  reviews?: {
    id: string;
    author: string;
    role: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }[];
};

const SUPPORTING_GALLERY_IMAGES: Record<string, string[]> = {
  "Photo Studios": [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  ],
  "Sound Stages": [
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
  ],
  "Podcast Rooms": [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
  ],
  "Music Suites": [
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  ],
  "Art Workshops": [
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  ],
};

const DEFAULT_AMENITIES = [
  { icon: "wifi", name: "High-speed Gigabit WiFi (950 Mbps)" },
  { icon: "sun", name: "Floor-to-Ceiling North Daylight" },
  { icon: "volume", name: "Acoustically Isolated (NC-25 Rated)" },
  { icon: "power", name: "100A 3-Phase Camlock Distro" },
  { icon: "truck", name: "Drive-In Freight Elevator & Loading Dock" },
  { icon: "airplay", name: "Color-Balanced Client Lounge & Monitor" },
  { icon: "coffee", name: "Espresso Bar, Craft Catering Kitchen" },
  { icon: "shield", name: "Contactless Keycode Digital Smart Entry" },
];

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    author: "Elena Rostova",
    role: "Senior Director of Photography, Condé Nast",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "October 2026",
    comment:
      "The ceiling clearance and natural daylight in this studio are absolutely unmatched. The host was on standby and check-in via keypad took 10 seconds. We wrapped an 8-page lookbook ahead of schedule.",
  },
  {
    id: "rev-2",
    author: "Julian Vance",
    role: "Commercial Producer, Vaynermedia",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "September 2026",
    comment:
      "Acoustic isolation performed flawlessly with heavy street traffic outside. Clean power distro allowed our 600W cinema lights to run without tripping. Will definitely rebook.",
  },
  {
    id: "rev-3",
    author: "Maya Lin",
    role: "Independent Showrunner & Sundance Fellow",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    date: "August 2026",
    comment:
      "Spacious, turn-key, and impeccably maintained. The client viewing lounge kept the agency comfortable while our director was on the floor. 10/10 venue.",
  },
];

interface StudioDetailsClientProps {
  initialStudio: StudioDetail;
}

export function StudioDetailsClient({
  initialStudio,
}: StudioDetailsClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [studio] = useState<StudioDetail>(initialStudio);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedHours, setSelectedHours] = useState(4);

  const handleOpenBooking = () => {
    if (!session?.user) {
      toast.info("Please sign in to book this workspace.");
      const currentPath = `/studios/${studio._id}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }
    setIsBookingOpen(true);
  };

  // Build full 5-photo gallery array prioritizing user-uploaded studio.images
  const rawImages =
    studio.images && studio.images.length > 0
      ? studio.images
      : [studio.image];

  const categoryGallery =
    SUPPORTING_GALLERY_IMAGES[studio.category] ||
    SUPPORTING_GALLERY_IMAGES["Photo Studios"];

  const allImages = [
    ...rawImages,
    ...categoryGallery.filter((url) => !rawImages.includes(url)),
  ].slice(0, 5);

  // Dynamic host info from database
  const hostName =
    studio.ownerName?.trim() || studio.host?.name || "StudioSpace Verified Host";
  const hostEmail = studio.ownerEmail || null;
  const memberSince = studio.createdAt
    ? `Listed ${new Date(studio.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`
    : (studio.host?.joined ?? "Joined 2026");

  const hostBio =
    studio.host?.bio ||
    (studio.ownerName
      ? `Verified production host and space manager for ${studio.title}. Operating in ${studio.location} with immediate response availability for bookings and walkthroughs.`
      : "Commercial photographer & stage curator with 10+ years managing daylight soundstages and creative production lofts.");

  const hostAvatar =
    studio.host?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName)}&background=ff5c1a&color=fff&size=200&bold=true`;

  const host = {
    name: hostName,
    email: hostEmail,
    avatar: hostAvatar,
    responseRate: studio.host?.responseRate || "100%",
    responseTime: studio.host?.responseTime || "Within 15 minutes",
    verified: studio.host?.verified ?? true,
    joined: memberSince,
    bio: hostBio,
  };

  // Dynamic amenities list
  const amenities =
    studio.amenities && studio.amenities.length > 0
      ? studio.amenities.map((item) =>
          typeof item === "string" ? { name: item } : item,
        )
      : DEFAULT_AMENITIES;

  const reviews = studio.reviews ?? DEFAULT_REVIEWS;
  const capacity = studio.capacity ?? 35;
  const securityDeposit = studio.securityDeposit ?? 150;
  const squareFeet = studio.squareFeet ?? (capacity * 80 || 2800);
  const ceilingHeight = studio.ceilingHeight ?? "16 ft";

  const estimatedTotal = studio.hourlyRate * selectedHours;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removed from favorites" : "Saved to your favorites!",
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Top Breadcrumb & Actions Bar ── */}
      <div className="border-b border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Studios</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={toggleFavorite}
              className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold transition-colors ${
                isFavorite
                  ? "text-red-500 border-red-500/30"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Heart
                className={`size-3.5 ${isFavorite ? "fill-red-500" : ""}`}
              />
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* ── Hero Section ── */}
        <div className="space-y-3 pb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-brand/10 border border-brand/30 px-3 py-0.5 text-xs font-semibold text-brand tracking-wide uppercase">
              {studio.category}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Verified StudioSpace Stage
            </span>
            <span className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Zap className="size-3 text-amber-500" />
              Instant Booking Available
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {studio.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-1">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Star className="size-4 fill-amber-500 text-amber-500" />
              <span>{Number(studio.rating).toFixed(2)}</span>
              <span className="font-normal text-muted-foreground">
                ({studio.reviewCount} verified reviews)
              </span>
            </div>
            <span>•</span>
            <span className="text-foreground font-medium">
              {studio.location}
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Available Today
            </span>
          </div>
        </div>

        {/* ── Gallery Carousel ── */}
        <div className="py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Primary Main View */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[480px] lg:col-span-8 rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-border group shadow-sm">
              <Image
                src={allImages[selectedImageIndex] ?? studio.image}
                alt={studio.title}
                fill
                unoptimized
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Prev/Next Carousel arrows */}
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? allImages.length - 1 : prev - 1,
                  )
                }
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-110 transition-all"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === allImages.length - 1 ? 0 : prev + 1,
                  )
                }
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-110 transition-all"
              >
                <ChevronRight className="size-5" />
              </button>

              <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Supporting Visuals Thumbnails */}
            <div className="grid grid-cols-4 lg:grid-cols-2 lg:col-span-4 gap-2 sm:gap-3 lg:h-[480px]">
              {allImages.slice(1, 5).map((imgUrl, idx) => {
                const actualIndex = idx + 1;
                const isSelected = selectedImageIndex === actualIndex;
                return (
                  <button
                    key={imgUrl}
                    type="button"
                    onClick={() => setSelectedImageIndex(actualIndex)}
                    className={`relative w-full h-20 sm:h-24 lg:h-full rounded-xl sm:rounded-2xl overflow-hidden border transition-all ${
                      isSelected
                        ? "border-brand ring-2 ring-brand/30 scale-[0.98]"
                        : "border-border/80 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${actualIndex}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Content Layout: Two-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 sm:pt-12">
          {/* ── Left Column: Content ── */}
          <div className="lg:col-span-8 space-y-10 sm:space-y-12">
            {/* Quick Spec Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-card/60">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Maximize2 className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Size
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {squareFeet.toLocaleString()} sq ft
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Sun className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Ceiling
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {ceilingHeight} Clear
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Capacity
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    Up to {capacity} Crew
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <DoorOpen className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Access
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    Self Check-In
                  </p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                About this Production Stage
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base space-y-4">
                <p>{studio.description}</p>
                <p>
                  Engineered specifically for film directors, commercial
                  producers, editorial portraitists, and broadcast podcasters
                  requiring reliable, climate-controlled, turn-key studio
                  environments. The space features heavy electrical capacity,
                  modular light-blocking drapery, clean perimeter soundproofing,
                  and designated craft service break-out zones.
                </p>
                <p>
                  Direct street-level or oversized freight elevator access makes
                  load-in and gear staging seamless for grip vans, sound carts,
                  and lighting trucks.
                </p>
              </div>
            </div>

            {/* Workspace Specifications */}
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Workspace Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground">
                    {studio.category}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-foreground">
                    {studio.location}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                  <span className="text-muted-foreground">Maximum Crew Capacity</span>
                  <span className="font-semibold text-foreground">
                    Up to {capacity} People
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-semibold text-foreground">
                    ${securityDeposit} (Refundable)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="font-semibold text-brand">
                    ${studio.hourlyRate} / hour
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                  <span className="text-muted-foreground">Space Size</span>
                  <span className="font-semibold text-foreground">
                    {squareFeet.toLocaleString()} sq ft ({ceilingHeight} Ceilings)
                  </span>
                </div>
              </div>
            </div>

            {/* Amenity List */}
            <div className="space-y-5 border-t border-border pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Amenities &amp; Studio Features
                </h2>
                <span className="text-xs text-muted-foreground">
                  {amenities.length} Verified Inclusions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {amenities.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card/60 text-sm font-medium text-foreground"
                  >
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-4" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Profile */}
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Hosted by {host.name}
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-2xl border border-border bg-card shadow-2xs">
                <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden shrink-0 border border-brand/20 bg-muted">
                  <Image
                    src={host.avatar}
                    alt={host.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {host.name}
                    </h3>
                    {host.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[11px] font-semibold">
                        <Award className="size-3" />
                        Verified Host
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>{host.joined}</span>
                    <span>•</span>
                    <span>Response time: {host.responseTime}</span>
                    {host.email && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-brand font-medium">
                          {host.email}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
                    {host.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Creator Reviews */}
            <div className="space-y-6 border-t border-border pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <span>Creator Reviews</span>
                    <span className="text-base text-brand font-bold">
                      ★ {Number(studio.rating).toFixed(2)}
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Based on {studio.reviewCount} verified productions
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-border/80 bg-card/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={rev.avatar}
                            alt={rev.author}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {rev.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rev.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-brand">
                        <Star className="size-3.5 fill-brand text-brand" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="text-[11px] text-muted-foreground/70 font-medium">
                      Booked for a full production • {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Sticky Booking Card ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-border/90 bg-card p-6 sm:p-7 shadow-lg space-y-5">
              {/* Hourly Rate Header */}
              <div className="flex items-baseline justify-between border-b border-border/70 pb-5">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground ml-1.5">
                    / hour
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span>{Number(studio.rating).toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {studio.reviewCount} reviews
                  </span>
                </div>
              </div>

              {/* Quick Hours Calculator */}
              <div className="space-y-3 bg-muted/30 p-3.5 rounded-2xl border border-border/70 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Estimated Hours:
                  </span>
                  <select
                    value={selectedHours}
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground font-semibold outline-none focus:border-brand/60"
                  >
                    <option value={2}>
                      2 Hours ($ {studio.hourlyRate * 2})
                    </option>
                    <option value={4}>
                      4 Hours ($ {studio.hourlyRate * 4})
                    </option>
                    <option value={6}>
                      6 Hours ($ {studio.hourlyRate * 6})
                    </option>
                    <option value={8}>
                      8 Hours ($ {studio.hourlyRate * 8})
                    </option>
                    <option value={10}>
                      10 Hours ($ {studio.hourlyRate * 10})
                    </option>
                  </select>
                </div>

                <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/50">
                  <span>Security Deposit:</span>
                  <span className="font-semibold text-foreground">
                    ${securityDeposit} (Refundable)
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground pt-1">
                  <span>Estimated Total:</span>
                  <span className="font-bold text-foreground text-sm">
                    ${estimatedTotal}
                  </span>
                </div>
              </div>

              {/* Prominent CTA */}
              <button
                type="button"
                onClick={handleOpenBooking}
                className="w-full h-13 flex items-center justify-center gap-2 rounded-full bg-brand hover:bg-brand-strong text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <Sparkles className="size-4" />
                <span>Book Workspace Now</span>
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                You won&apos;t be charged yet. Instant confirmation upon
                checkout.
              </p>

              {/* Trust Badges in Sticky Card */}
              <div className="space-y-2.5 pt-4 border-t border-border/70 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>$1,000,000 Host &amp; Gear Insurance included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-brand shrink-0" />
                  <span>Free cancellation up to 48 hours prior</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-amber-500 shrink-0" />
                  <span>Keycode check-in delivered instantly via SMS</span>
                </div>
              </div>

              {/* Host Snippet Card */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/70 text-xs">
                <div className="relative size-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={host.avatar}
                    alt={host.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">
                    Hosted by {host.name}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Response rate: {host.responseRate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      <BookingModal
        studio={studio}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
