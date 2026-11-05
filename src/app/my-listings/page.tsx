"use client";

import {
  AlertCircle,
  DollarSign,
  Edit,
  Eye,
  Grid,
  List,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteConfirmModal from "@/components/studios/DeleteConfirmModal";
import { useSession } from "@/lib/auth-client";

interface Studio {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  description?: string;
  ownerEmail?: string;
  specs?: string;
}

const SKELETON_KEYS = ["ls-sk-1", "ls-sk-2", "ls-sk-3", "ls-sk-4"];

export default function MyListingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [refreshKey, setRefreshKey] = useState(0);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update State
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    hourlyRate: 0,
    category: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?callbackUrl=/my-listings");
      return;
    }

    void refreshKey;
    const email = session.user.email;
    setLoading(true);
    setError("");

    fetch(
      `http://localhost:5000/studios?ownerEmail=${encodeURIComponent(email)}`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load listings (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setStudios(data.data);
        } else {
          setError(data.message || "Failed to load listings.");
        }
      })
      .catch((err) => {
        setError(err.message || "Could not connect to the studios database.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session, isPending, router, refreshKey]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/studios/${deleteTarget._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to delete studio listing.");
        setIsDeleting(false);
        return;
      }

      setStudios((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.title}" deleted successfully!`);
      setDeleteTarget(null);
    } catch {
      toast.error("Network error: Could not complete deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (studio: Studio) => {
    setEditingStudio(studio);
    setUpdateFormData({
      title: studio.title,
      hourlyRate: studio.hourlyRate,
      category: studio.category,
      location: studio.location,
      description: studio.description || "",
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudio) return;
    setIsUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:5000/studios/${editingStudio._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateFormData),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to update studio.");
        setIsUpdating(false);
        return;
      }

      setStudios((prev) =>
        prev.map((s) =>
          s._id === editingStudio._id ? { ...s, ...updateFormData } : s,
        ),
      );
      toast.success("Studio details updated successfully!");
      setEditingStudio(null);
    } catch {
      toast.error("Network error: Could not update studio.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending || (!session?.user && !error)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-brand" />
          <p className="text-xs font-medium text-muted-foreground">
            Verifying host credentials…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand mb-1">
                <Sparkles className="size-3.5" />
                <span>Host Management</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                My Studio Listings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your creative spaces, modify rates, and monitor listings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:inline-flex items-center rounded-full border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("card")}
                  aria-label="Card view"
                  className={`flex size-8 items-center justify-center rounded-full transition-colors ${
                    viewMode === "card"
                      ? "bg-background text-brand shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  className={`flex size-8 items-center justify-center rounded-full transition-colors ${
                    viewMode === "table"
                      ? "bg-background text-brand shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>

              <Link
                href="/add-studio"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
              >
                <Plus className="size-4" />
                <span>List New Space</span>
              </Link>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKELETON_KEYS.map((key) => (
                <div
                  key={key}
                  className="rounded-3xl border border-border bg-card p-5 animate-pulse"
                >
                  <div className="aspect-video w-full rounded-2xl bg-muted mb-4" />
                  <div className="space-y-2">
                    <div className="h-5 w-48 rounded bg-muted" />
                    <div className="h-4 w-64 rounded bg-muted" />
                    <div className="h-9 w-full rounded-full bg-muted mt-4" />
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
                Failed to retrieve listings
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
          {!loading && !error && studios.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-12 sm:p-16 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-4">
                <MapPin className="size-7" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                No Spaces Listed Yet
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                You haven&apos;t listed any production studios under your
                account (
                <span className="font-medium text-foreground">
                  {session?.user?.email}
                </span>
                ). Turn your creative loft, audio room, or stage into revenue.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/add-studio"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
                >
                  <Plus className="size-4" />
                  <span>Host Your Space</span>
                </Link>
                <Link
                  href="/studios"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          )}

          {/* Active Studios: Card View */}
          {!loading && !error && studios.length > 0 && viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studios.map((studio) => (
                <div
                  key={studio._id}
                  className="group rounded-3xl border border-border bg-card overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Studio Image Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-block rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-md">
                        {studio.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
                      <div>
                        <p className="text-xs text-white/80 flex items-center gap-1">
                          <MapPin className="size-3 text-brand" />
                          <span>{studio.location}</span>
                        </p>
                        <h2 className="text-lg font-bold tracking-tight text-white line-clamp-1">
                          {studio.title}
                        </h2>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <span className="text-xl font-bold text-white">
                          ${studio.hourlyRate}
                        </span>
                        <span className="text-[11px] text-white/80 block">
                          / hour
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <strong className="text-foreground">
                            {Number(studio.rating || 4.9).toFixed(2)}
                          </strong>
                          <span>({studio.reviewCount || 12} reviews)</span>
                        </span>
                        <span className="text-[11px]">
                          Ref: #{studio._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      {studio.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {studio.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons: Update and Delete */}
                    <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                      <Link
                        href={`/studios/${studio._id}`}
                        className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/30 text-foreground hover:bg-muted transition-colors shrink-0"
                        title="View Public Details"
                        aria-label="View Public Details"
                      >
                        <Eye className="size-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(studio)}
                        className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted hover:border-brand/40 transition-colors shadow-2xs"
                      >
                        <Edit className="size-3.5 text-brand" />
                        <span>Update Listing</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(studio)}
                        className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-2xs"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Studios: Table View */}
          {!loading && !error && studios.length > 0 && viewMode === "table" && (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Studio Space</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Rate</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {studios.map((studio) => (
                      <tr
                        key={studio._id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative size-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                              <Image
                                src={studio.image}
                                alt={studio.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/studios/${studio._id}`}
                                className="font-bold text-foreground hover:text-brand transition-colors truncate block"
                              >
                                {studio.title}
                              </Link>
                              <span className="text-[11px] text-muted-foreground">
                                Ref: #{studio._id.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                            {studio.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-muted-foreground">
                          {studio.location}
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-foreground">
                            ${studio.hourlyRate}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            /hr
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 font-medium text-foreground">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {Number(studio.rating || 4.9).toFixed(2)}
                          </span>
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(studio)}
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                              <Edit className="size-3 text-brand" />
                              <span>Update</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(studio)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3 py-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="size-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Count */}
          {!loading && !error && studios.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-6">
              Displaying {studios.length} space
              {studios.length !== 1 ? "s" : ""} registered to your host profile.
            </p>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        studioTitle={deleteTarget?.title || ""}
        isDeleting={isDeleting}
      />

      {/* Update Studio Modal */}
      {editingStudio && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl text-foreground max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingStudio(null)}
              disabled={isUpdating}
              aria-label="Close modal"
              className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand uppercase tracking-wider">
                <Edit className="size-3.5" />
                Modify Workspace
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Update Studio Details
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ref ID: #{editingStudio._id.slice(-6).toUpperCase()}
            </p>

            <form onSubmit={handleUpdateSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Studio Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  required
                  value={updateFormData.title}
                  onChange={(e) =>
                    setUpdateFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="edit-rate"
                    className="block text-xs font-semibold text-foreground mb-1"
                  >
                    Hourly Rate (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      id="edit-rate"
                      type="number"
                      required
                      min={10}
                      max={2000}
                      value={updateFormData.hourlyRate}
                      onChange={(e) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          hourlyRate: Number(e.target.value),
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-category"
                    className="block text-xs font-semibold text-foreground mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
                    value={updateFormData.category}
                    onChange={(e) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="Photo Studios">Photo Studios</option>
                    <option value="Sound Stages">Sound Stages</option>
                    <option value="Podcast Rooms">Podcast Rooms</option>
                    <option value="Music Suites">Music Suites</option>
                    <option value="Art Workshops">Art Workshops</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-location"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Location (City, State)
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="edit-location"
                    type="text"
                    required
                    value={updateFormData.location}
                    onChange={(e) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-desc"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Description
                </label>
                <textarea
                  id="edit-desc"
                  rows={3}
                  value={updateFormData.description}
                  onChange={(e) =>
                    setUpdateFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 resize-none"
                />
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudio(null)}
                  disabled={isUpdating}
                  className="flex-1 h-11 rounded-full border border-border bg-muted/40 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-brand text-xs font-semibold text-white hover:bg-brand-strong transition-colors disabled:opacity-60 shadow-xs"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Changes…</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
