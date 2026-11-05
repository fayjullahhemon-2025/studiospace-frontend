"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import type { StudioDetail } from "@/components/studios/StudioDetailsClient";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface BookingModalProps {
  studio: StudioDetail;
  isOpen: boolean;
  onClose: () => void;
}

function calculateEndTime(startTime: string, durationHours: number): string {
  const [hourStr, minStr] = startTime.split(":");
  const hour = parseInt(hourStr, 10);
  const endHour = hour + durationHours;
  const formattedHour = endHour < 10 ? `0${endHour}` : `${endHour}`;
  return `${formattedHour}:${minStr || "00"}`;
}

export function BookingModal({ studio, isOpen, onClose }: BookingModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [date, setDate] = useState("2026-11-15");
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(4);
  const [attendees, setAttendees] = useState(6);
  const [projectType, setProjectType] = useState("Photo Shoot");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  if (!isOpen) return null;

  const basePrice = studio.hourlyRate * duration;
  const cleaningFee = 50;
  const serviceFee = Math.round(basePrice * 0.1);
  const totalPrice = basePrice + cleaningFee + serviceFee;
  const computedEndTime = calculateEndTime(startTime, duration);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getTokenFromClient();
      console.log("Token:", token);
      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-user-email": session?.user?.email || "",
          "x-user-name": session?.user?.name || "",
        },
        body: JSON.stringify({
          studioId: studio._id,
          studioTitle: studio.title,
          bookingDate: date,
          startTime: startTime,
          endTime: computedEndTime,
          totalAmount: totalPrice,
          userEmail: session?.user?.email,
          userName: session?.user?.name,
        }),
      });

      const data = await response.json();

      if (response.status === 409 || !response.ok) {
        toast.error(
          data.message ||
          "This time slot is already booked. Please choose another time.",
        );
        setIsSubmitting(false);
        return;
      }

      setConfirmedBookingId(data.data?.insertedId || "#7892-SS");
      setIsConfirmed(true);
      toast.success("Workspace booked successfully!");
    } catch {
      toast.error(
        "Failed to place booking. Please check connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setIsConfirmed(false);
    onClose();
    router.push("/my-bookings");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        {isConfirmed ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              You are all set for{" "}
              <span className="font-semibold text-foreground">
                {studio.title}
              </span>{" "}
              on <span className="font-semibold text-foreground">{date}</span>{" "}
              at {startTime} for {duration} hours.
            </p>

            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Digital Access Code:
                </span>
                <span className="font-mono font-bold text-brand tracking-widest">
                  {confirmedBookingId
                    ? `#${confirmedBookingId.slice(-6).toUpperCase()}`
                    : "#7892-SS"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-foreground">
                  {studio.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid:</span>
                <span className="font-bold text-foreground">${totalPrice}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Smart check-in instructions and emergency contact info have been
              sent to your email.
            </p>

            <button
              type="button"
              onClick={handleDone}
              className="w-full h-11 rounded-full bg-brand text-white font-semibold text-sm hover:bg-brand-strong transition-colors"
            >
              View My Bookings →
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                Reserve Space
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Book {studio.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {studio.location} • ${studio.hourlyRate}/hr
            </p>

            {/* Studio Summary Card */}
            <div className="my-5 flex items-center gap-3.5 rounded-2xl border border-border/80 bg-muted/30 p-3">
              <div className="relative size-16 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={studio.image}
                  alt={studio.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase text-brand tracking-wider">
                  {studio.category}
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  {studio.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  ★ {Number(studio.rating).toFixed(2)} ({studio.reviewCount}{" "}
                  reviews)
                </p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Date */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-semibold text-foreground mb-1"
                  >
                    Shoot Date
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label
                    htmlFor="booking-time"
                    className="block text-xs font-semibold text-foreground mb-1"
                  >
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <select
                      id="booking-time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Duration */}
                <div>
                  <label
                    htmlFor="booking-duration"
                    className="block text-xs font-semibold text-foreground mb-1"
                  >
                    Duration (Hours)
                  </label>
                  <select
                    id="booking-duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  >
                    <option value={2}>2 Hours (Minimum)</option>
                    <option value={4}>4 Hours (Half Day)</option>
                    <option value={6}>6 Hours</option>
                    <option value={8}>8 Hours (Full Day)</option>
                    <option value={10}>10 Hours</option>
                    <option value={12}>12 Hours (Extended)</option>
                  </select>
                </div>

                {/* Attendees */}
                <div>
                  <label
                    htmlFor="booking-attendees"
                    className="block text-xs font-semibold text-foreground mb-1"
                  >
                    Cast &amp; Crew Size
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      id="booking-attendees"
                      type="number"
                      min={1}
                      max={40}
                      value={attendees}
                      onChange={(e) => setAttendees(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label
                  htmlFor="booking-project"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Production Type
                </label>
                <select
                  id="booking-project"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                >
                  <option value="Photo Shoot">Commercial Photography</option>
                  <option value="Film Production">
                    Video / Film Production
                  </option>
                  <option value="Podcast">Podcast Recording</option>
                  <option value="Music Recording">
                    Music Video / Audio Session
                  </option>
                  <option value="Creative Workshop">
                    Creative Workshop / Event
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Production Notes (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Lighting gear, load-in requirements, special sound requests..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 resize-none"
                />
              </div>

              {/* Pricing Breakdown */}
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    ${studio.hourlyRate} × {duration} hours
                  </span>
                  <span className="font-semibold text-foreground">
                    ${basePrice}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Studio Cleaning &amp; Reset</span>
                  <span className="font-semibold text-foreground">
                    ${cleaningFee}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Host Protection &amp; Platform Fee</span>
                  <span className="font-semibold text-foreground">
                    ${serviceFee}
                  </span>
                </div>
                <div className="h-px bg-border pt-1" />
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span className="text-foreground">Total (USD)</span>
                  <span className="text-brand text-base">${totalPrice}</span>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Lock className="size-3.5 text-emerald-600 shrink-0" />
                <span>
                  256-bit encrypted checkout. No charges until host
                  confirmation.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-brand hover:bg-brand-strong text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-60"
              >
                <CreditCard className="size-4" />
                <span>
                  {isSubmitting
                    ? "Processing Reservation..."
                    : `Confirm Booking • $${totalPrice}`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
