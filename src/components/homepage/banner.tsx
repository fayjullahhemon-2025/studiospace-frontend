"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

export type BannerSlide = {
  _id?: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  specs: string;
  price: number | string;
};

const defaultSlides: BannerSlide[] = [
  {
    _id: "6aec02040a3f672737566db3",
    title: "Sunlit Cyclorama Stage A",
    category: "PHOTOGRAPHIC LOFT • SOHO NY",
    specs: "Natural North-Facing Daylight • 18ft Ceilings • 2,800 sq ft",
    price: 120,
    description:
      "A bright, spacious industrial photo and video studio with large windows, white cyclorama wall, and professional lighting equipment.",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    _id: "6aec02040a3f672737566db2",
    title: "Warm Cinematic Soundstage",
    category: "FILM PRODUCTION • BROOKLYN NY",
    specs: "Camera Dolly Tracks • Full Grid Rigging • 3,200 sq ft",
    price: 145,
    description:
      "A film or video production set inside a warm industrial studio loft with a camera dolly track, crew members, and leather chairs.",
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  },
  {
    _id: "6aec02040a3f672737566db4",
    title: "Curated Modern Studio Loft",
    category: "ARCHITECTURAL LOFT • TRIBECA NY",
    specs: "Mid-Century Furnishings • Factory Windows • 2,100 sq ft",
    price: 95,
    description:
      "Two women talking inside a stylish, sunlit modern industrial loft apartment featuring large factory windows, plants, and mid-century decor.",
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
];

type ApiBannerImage = {
  _id?: string;
  title?: string;
  description?: string;
  url?: string;
};

export function Banner() {
  const [slides, setSlides] = useState<BannerSlide[]>(defaultSlides);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadBannerImages() {
      try {
        const response = await fetch("http://localhost:5000/banner-images");
        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.status}`);
        }
        const data: unknown = await response.json();

        if (isMounted && Array.isArray(data) && data.length > 0) {
          const apiImages = data as ApiBannerImage[];

          // Locate the cyclorama stage to ensure it's the hero slide (slide 0) matching the UI
          const cycloramaIndex = apiImages.findIndex((item) =>
            item.url?.includes("photo-1513694203232"),
          );

          const orderedImages =
            cycloramaIndex > 0
              ? [
                  apiImages[cycloramaIndex],
                  ...apiImages.filter((_, idx) => idx !== cycloramaIndex),
                ]
              : apiImages;

          const merged: BannerSlide[] = orderedImages.map((item, index) => {
            const fallback = defaultSlides[index % defaultSlides.length];
            return {
              _id: item._id ?? fallback._id,
              title: fallback.title,
              category: fallback.category,
              specs: fallback.specs,
              price: fallback.price,
              description: item.description ?? fallback.description,
              url: item.url ?? fallback.url,
            };
          });

          setSlides(merged);
        }
      } catch (err) {
        console.warn("Notice: Using fallback high-res banner slides:", err);
      }
    }

    loadBannerImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] dark:bg-background py-10 sm:py-14 lg:py-18">
      {/* Subtle Dot Matrix Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#d1d5db_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#374151_1.2px,transparent_1.2px)] [background-size:22px_22px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading, Subtext, CTAs, Stats */}
          <div className="flex flex-col justify-center lg:col-span-5 xl:col-span-5">
            {/* Top Curated Spaces Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#cce4ce] bg-[#ebf6ed] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#2d6a4f] uppercase w-fit">
              <Compass className="size-3.5" />
              <span>Curated Production Spaces</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-[52px] xl:text-[56px] leading-[1.08]">
              Your Creative
              <br />
              Vision Deserves
              <br />
              the Perfect Space.
            </h1>

            {/* Subtext */}
            <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              Discover and book inspiring photography studios, film stages,
              podcast rooms, and bespoke creative workspaces with transparent
              rates and instant access.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href="/studios"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1917] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                <span>Explore Studios</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/studios"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200/90 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-800 shadow-2xs transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Host Your Space
              </Link>
            </div>

            {/* Stats Row */}
            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  320+
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Vetted Studios
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  4.96
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Average Rating
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ff5c1a]">
                  100%
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Verified Hosts
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Image Slider Card */}
          <div className="relative lg:col-span-7 xl:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:h-[480px] xl:h-[500px] w-full overflow-hidden rounded-[28px] sm:rounded-[32px] border border-neutral-200/60 dark:border-neutral-800 bg-neutral-900 shadow-2xl">
              {/* Swiper Slider */}
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={slides.length > 1}
                speed={700}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => setSwiperInstance(swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full w-full"
              >
                {slides.map((slide, idx) => (
                  <SwiperSlide
                    key={slide._id ?? idx}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={slide.url}
                      alt={slide.title}
                      fill
                      unoptimized
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="h-full w-full object-cover"
                    />

                    {/* Dark gradient for text readability at bottom */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
                    />

                    {/* Bottom Left Studio Info */}
                    <div className="absolute bottom-6 left-6 right-28 sm:bottom-8 sm:left-8 z-10 text-white">
                      <span className="inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-widest text-white/90 uppercase backdrop-blur-md">
                        {slide.category}
                      </span>
                      <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {slide.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm font-medium text-white/80">
                        {slide.specs}
                      </p>
                    </div>

                    {/* Bottom Right Hourly Price */}
                    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-10 text-right">
                      <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                        ${slide.price}
                      </span>
                      <span className="text-xs sm:text-sm font-normal text-white/80">
                        /hr
                      </span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Top Left Floating Badges */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className="rounded-full border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-neutral-900 shadow-xs backdrop-blur-md">
                  Live Availability
                </span>
                <span className="rounded-full bg-[#ff5c1a] px-3 py-1 text-xs font-semibold text-white shadow-xs">
                  Instant Book
                </span>
              </div>

              {/* Top Right Frosted Glass Slider Navigation */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-2.5 rounded-full border border-white/60 bg-white/80 px-2.5 py-1.5 shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-black/60">
                <button
                  type="button"
                  onClick={() => swiperInstance?.slidePrev()}
                  aria-label="Previous studio slide"
                  className="flex size-6 items-center justify-center rounded-full text-neutral-700 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
                >
                  <ChevronLeft className="size-3.5" />
                </button>

                {/* Pagination Dots (Active is elongated orange pill) */}
                <div className="flex items-center gap-1.5 px-0.5">
                  {slides.map((slide, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <button
                        key={slide._id ?? idx}
                        type="button"
                        onClick={() => swiperInstance?.slideToLoop(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "h-1.5 w-4 rounded-full bg-[#ff5c1a]"
                            : "size-1.5 rounded-full bg-neutral-400/80 hover:bg-neutral-600 dark:bg-neutral-500"
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  aria-label="Next studio slide"
                  className="flex size-6 items-center justify-center rounded-full text-neutral-700 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
