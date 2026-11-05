"use client";

import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CalendarX,
  Clock,
  Compass,
  DollarSign,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmptyState from "@/components/shared/EmptyState";
import { useSession } from "@/lib/auth-client";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  userEmail: string;
  userName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt?: string;
}

const SKELETON_KEYS = ["bk-sk-1", "bk-sk-2", "bk-sk-3", "bk-sk-4", "bk-sk-5"];

function statusBadge(status: Booking["status"]) {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "Cancelled":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
}

function formatTimeString(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return t;
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m || "00"} ${suffix}`;
}

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Cancellation State
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Deletion State
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?callbackUrl=/my-bookings");
      return;
    }

    void refreshKey;
    const email = session.user.email;
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/bookings/${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load bookings (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          setError(data.message || "Failed to load bookings.");
        }
      })
      .catch((err) => {
        setError(err.message || "Could not connect to the booking service.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session, isPending, router, refreshKey]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget || !session?.user?.email) return;
    setIsCancelling(true);

    try {
      const response = await fetch(
        `http://localhost:5000/bookings/${cancelTarget._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": session.user.email,
          },
          body: JSON.stringify({
            userEmail: session.user.email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to cancel reservation.");
        setIsCancelling(false);
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id
            ? { ...b, status: "Cancelled" as const }
            : b,
        ),
      );
      toast.success("Booking cancelled successfully!");
      setCancelTarget(null);
    } catch {
      toast.error("Network error: Could not cancel reservation.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !session?.user?.email) return;
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/bookings/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": session.user.email,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to delete booking.");
        setIsDeleting(false);
        return;
      }

      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("Booking deleted successfully!");
      setDeleteTarget(null);
    } catch {
      toast.error("Network error: Could not complete booking deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPending || (!session?.user && !error)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-brand" />
          <p className="text-xs font-medium text-muted-foreground">
            Authenticating your session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand mb-1">
              <Sparkles className="size-3.5" />
              <span>Production Schedule</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              My Bookings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage all your studio session reservations.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
          >
            Explore More Studios
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-border bg-card p-5 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2.5 flex-1">
                    <div className="h-5 w-56 rounded bg-muted" />
                    <div className="h-4 w-72 rounded bg-muted" />
                    <div className="h-3 w-40 rounded bg-muted" />
                  </div>
                  <div className="h-9 w-28 rounded-full bg-muted shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/20 p-8 text-center">
            <AlertCircle className="size-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Unable to load reservations
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-md mx-auto">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-800 bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            icon={CalendarX}
            badge="Schedule Clear"
            title="No Studio Bookings Found"
            description="You haven't reserved any creative stages or production workspaces yet. Explore vetted photography lofts, cinematic sound stages, and podcast rooms with instant confirmation."
            tips={[
              "Browse top-rated photography lofts, sound stages, and audio suites",
              "Select custom shoot hours with instant double-booking prevention",
              "Enjoy transparent pricing with security deposits and host equipment included",
            ]}
            primaryAction={{
              label: "Browse Curated Studios",
              icon: Compass,
              href: "/studios",
            }}
            secondaryAction={{
              label: "How Booking Works",
              icon: Sparkles,
              href: "/#howitworks",
            }}
          />
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <h2 className="text-lg font-bold text-foreground truncate">
                        {booking.studioTitle}
                      </h2>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadge(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-brand shrink-0" />
                        <span className="font-medium text-foreground">
                          {booking.bookingDate}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-brand shrink-0" />
                        <span>
                          {formatTimeString(booking.startTime)} –{" "}
                          {formatTimeString(booking.endTime)}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-brand shrink-0" />
                        <span>
                          Total:{" "}
                          <strong className="text-foreground">
                            ${booking.totalAmount}
                          </strong>
                        </span>
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground/80">
                      <span>
                        Ref ID: #{booking._id.slice(-6).toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>
                        Booked by {booking.userName || booking.userEmail}
                      </span>
                    </div>
                  </div>

                  {/* Action Links & Buttons */}
                  <div className="shrink-0 flex items-center gap-2 sm:self-center">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-brand transition-colors"
                    >
                      <MapPin className="size-3.5" />
                      <span>View Studio</span>
                      <ExternalLink className="size-3 opacity-60" />
                    </Link>

                    {booking.status === "Pending" ? (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(booking)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 px-3.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shadow-2xs"
                      >
                        <XCircle className="size-3.5" />
                        <span>Cancel</span>
                      </button>
                    ) : booking.status === "Cancelled" ? (
                      <span className="inline-flex h-9 items-center px-2 text-xs font-medium text-muted-foreground/60">
                        Cancelled
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(booking)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-2xs"
                      title="Delete Booking Record"
                      aria-label="Delete Booking Record"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <p className="text-center text-xs text-muted-foreground pt-4">
              Showing {bookings.length} studio reservation
              {bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Cancel Reservation Confirmation Modal */}
      {cancelTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl text-foreground">
            <button
              type="button"
              onClick={() => setCancelTarget(null)}
              disabled={isCancelling}
              aria-label="Close dialog"
              className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="size-7" />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Cancel Reservation?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to cancel your reservation for{" "}
                <span className="font-semibold text-foreground">
                  &quot;{cancelTarget.studioTitle}&quot;
                </span>{" "}
                on {cancelTarget.bookingDate} (
                {formatTimeString(cancelTarget.startTime)} –{" "}
                {formatTimeString(cancelTarget.endTime)})?
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={isCancelling}
                className="flex-1 h-11 rounded-full border border-border bg-muted/40 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={isCancelling}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-red-600 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 shadow-xs"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Cancelling…</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    <span>Confirm Cancel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reservation Confirmation Modal */}
      {cancelTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl text-foreground">
            <button
              type="button"
              onClick={() => setCancelTarget(null)}
              disabled={isCancelling}
              aria-label="Close dialog"
              className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="size-7" />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Cancel Reservation?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to cancel your reservation for{" "}
                <span className="font-semibold text-foreground">
                  &quot;{cancelTarget.studioTitle}&quot;
                </span>{" "}
                on {cancelTarget.bookingDate} (
                {formatTimeString(cancelTarget.startTime)} –{" "}
                {formatTimeString(cancelTarget.endTime)})?
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={isCancelling}
                className="flex-1 h-11 rounded-full border border-border bg-muted/40 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={isCancelling}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-red-600 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 shadow-xs"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Cancelling…</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    <span>Confirm Cancel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Booking Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl text-foreground">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              aria-label="Close dialog"
              className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4">
              <Trash2 className="size-7" />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Delete Booking Record?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete the reservation record for{" "}
                <span className="font-semibold text-foreground">
                  &quot;{deleteTarget.studioTitle}&quot;
                </span>{" "}
                ({deleteTarget.bookingDate})? This document will be permanently
                removed from MongoDB.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-full border border-border bg-muted/40 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-red-600 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Booking Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl text-foreground">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              aria-label="Close dialog"
              className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4">
              <Trash2 className="size-7" />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Delete Booking Record?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete the reservation record for{" "}
                <span className="font-semibold text-foreground">
                  &quot;{deleteTarget.studioTitle}&quot;
                </span>{" "}
                ({deleteTarget.bookingDate})? This document will be permanently
                removed from MongoDB.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-full border border-border bg-muted/40 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-red-600 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
