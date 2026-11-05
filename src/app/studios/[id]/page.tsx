import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { StudioDetail } from "@/components/studios/StudioDetailsClient";
import { StudioDetailsClient } from "@/components/studios/StudioDetailsClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const res = await fetch(`http://localhost:5000/studios/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return { title: "Studio Details | StudioSpace" };
    const json = await res.json();
    const studio: StudioDetail = json.data;
    return {
      title: `${studio.title} | StudioSpace`,
      description:
        studio.description || `Book ${studio.title} in ${studio.location}`,
    };
  } catch {
    return { title: "Studio Details | StudioSpace" };
  }
}

async function getStudio(id: string): Promise<StudioDetail | null> {
  try {
    const res = await fetch(`http://localhost:5000/studios/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export default async function StudioDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-6">
          <div className="h-8 w-64 bg-muted rounded-xl" />
          <div className="h-96 w-full bg-muted rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-80 bg-muted rounded-3xl" />
            <div className="lg:col-span-4 h-80 bg-muted rounded-3xl" />
          </div>
        </div>
      }
    >
      <StudioDetailsClient initialStudio={studio} />
    </Suspense>
  );
}
