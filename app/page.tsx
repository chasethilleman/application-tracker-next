"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import AddApplicationModal from "@/components/addApplicationModal";
import ApplicationCard from "../components/applicationCard";
import Form from "../components/form";
import Header from "../components/header";

import type {
  ApplicationFormValues,
  ApplicationRecord,
} from "@shared/applicationSchema";

export default function Home() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) {
          throw new Error("Failed to load applications");
        }
        const data = (await response.json()) as ApplicationRecord[];
        if (!isCancelled) {
          setApplications(data);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load applications";
        if (!isCancelled) {
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    if (status === "loading") {
      setLoading(true);
      return () => {
        isCancelled = true;
      };
    }

    if (status !== "authenticated") {
      setApplications([]);
      setError(null);
      setLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    void loadApplications();

    return () => {
      isCancelled = true;
    };
  }, [status]);

  async function addApplication(application: ApplicationFormValues) {
    if (status !== "authenticated") {
      setError("You must be signed in to add applications.");
      return;
    }
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to save application");
      }

      const saved = (await response.json()) as ApplicationRecord;
      setApplications((prev) => [saved, ...prev]);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save application";
      setError(message);
      setConfetti(false);
      throw err;
    }
  }

  async function deleteApplication(id: string) {
    if (status !== "authenticated") {
      setError("You must be signed in to delete applications.");
      return;
    }
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to delete application");
      }

      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete application";
      setError(message);
      throw err;
    }
  }

  async function updateApplication(
    id: string,
    updates: ApplicationFormValues
  ): Promise<ApplicationRecord | void> {
    if (status !== "authenticated") {
      const message = "You must be signed in to update applications.";
      setError(message);
      throw new Error(message);
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to update application");
      }

      const updated = (await response.json()) as ApplicationRecord;
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update application";
      setError(message);
      throw err;
    }
  }

  const totalApplications = applications.length;
  const appliedApplications = applications.filter(
    (app) => app.status === "Applied"
  ).length;
  const interviewingApplications = applications.filter(
    (app) => app.status === "Interviewing"
  ).length;
  const offeredApplications = applications.filter(
    (app) => app.status === "Offered"
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected"
  ).length;
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const isSessionLoading = status === "loading";

  return (
    <>
      <div className="min-w-screen min-h-screen bg-white text-slate-900 transition-colors dark:bg-neutral-900 dark:text-white">
        <Header
          totalApplications={totalApplications}
          appliedApplications={appliedApplications}
          interviewingApplications={interviewingApplications}
          offeredApplications={offeredApplications}
          rejectedApplications={rejectedApplications}
          onAddApplication={() => setShowCreateModal(true)}
        />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 transition-colors sm:px-6 lg:px-8">
          {confetti && isAuthenticated && (
            <Fireworks autorun={{ speed: 3, duration: 3000 }} />
          )}
          {isSessionLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-600 dark:text-slate-300">
              <div
                className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                role="status"
                aria-label="Checking session"
              />
              <p>Checking your session…</p>
            </div>
          ) : isAuthenticated ? (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-start">
              <div className="hidden md:block">
                <Form addApplication={addApplication} />
              </div>
              <div className="applications-list md:col-span-2">
                {error && (
                  <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
                )}
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-slate-600 dark:text-slate-300">
                    <div
                      className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                      role="status"
                      aria-label="Loading applications"
                    />
                    <p>Loading applications…</p>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((application, index) => (
                      <ApplicationCard
                        key={application.id}
                        {...application}
                        deleteApplication={() =>
                          deleteApplication(application.id)
                        }
                        updateApplication={updateApplication}
                        animationDelay={index * 80}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-12 text-center text-slate-600 dark:border-slate-700 dark:bg-neutral-800/50 dark:text-slate-200">
                    <p className="text-xl font-semibold text-slate-700 dark:text-slate-100">
                      No applications yet
                    </p>
                    <p className="text-base">
                      Add your first application to start tracking every lead in one place.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-slate-700 dark:text-slate-200">
              <p className="text-lg font-medium">
                Sign in to track and manage your applications.
              </p>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900"
              >
                <Image
                  src="/google-icon.svg"
                  alt="Google logo"
                  width={18}
                  height={18}
                  className="h-4 w-4"
                />
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </main>
      </div>
      <AddApplicationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        addApplication={addApplication}
      />
    </>
  );
}
