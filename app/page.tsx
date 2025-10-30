"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { Plus } from "lucide-react";
import AddApplicationModal from "@/components/addApplicationModal";
import ApplicationCard from "../components/applicationCard";
import Header from "../components/header";

import {
  STATUS_OPTIONS,
  type ApplicationFormValues,
  type ApplicationRecord,
  type ApplicationStatus,
} from "@shared/applicationSchema";
import Filter from "@/components/filter";

export default function Home() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicationStatus>("All");

  useEffect(() => {
    let isCancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "All") params.set("status", statusFilter);
        const query = params.toString();

        const response = await fetch(
          query ? `/api/applications?${query}` : "/api/applications"
        );
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
  }, [status, statusFilter]);

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
      <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-neutral-900 dark:text-white flex flex-col">
        <Header
          totalApplications={totalApplications}
          appliedApplications={appliedApplications}
          interviewingApplications={interviewingApplications}
          offeredApplications={offeredApplications}
          rejectedApplications={rejectedApplications}
          onAddApplication={() => setShowCreateModal(true)}
        />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-8 transition-colors sm:px-6 lg:px-8 md:overflow-hidden">
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
            <>
              <div className="md:hidden sticky top-[6.5rem] z-10 bg-white pb-4 dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800">
                <Filter
                  statusFilter={statusFilter}
                  setStatusFilter={(status: string) =>
                    setStatusFilter(status as "All" | ApplicationStatus)
                  }
                  statusOptions={["All", ...STATUS_OPTIONS]}
                />
              </div>
              <div className="flex flex-col gap-4 md:grid md:h-full md:min-h-0 md:grid-cols-3 md:items-start md:gap-6 md:overflow-hidden">
                <div className="hidden md:flex md:h-full md:min-h-0 md:flex-col md:overflow-y-auto md:pr-4">
                  <div className="sticky top-0 z-[1] space-y-4 bg-white pb-2 dark:bg-neutral-900">
                    <button
                      type="button"
                      onClick={() => {
                        if (isAuthenticated) {
                          setShowCreateModal(true);
                        } else if (!isSessionLoading) {
                          void signIn("google");
                        }
                      }}
                      disabled={isSessionLoading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900"
                    >
                      {isAuthenticated ? (
                        <>
                          <Plus className="h-4 w-4" aria-hidden />
                          Add Application
                        </>
                      ) : (
                        <>
                          <Image
                            src="/google-icon.svg"
                            alt="Google logo"
                            width={18}
                            height={18}
                            className="h-4 w-4"
                          />
                          Sign in with Google
                        </>
                      )}
                    </button>
                    <Filter
                      statusFilter={statusFilter}
                      setStatusFilter={(status: string) =>
                        setStatusFilter(status as "All" | ApplicationStatus)
                      }
                      statusOptions={["All", ...STATUS_OPTIONS]}
                    />
                  </div>
                </div>
                <div className="applications-list md:col-span-2 md:h-full md:min-h-0 md:overflow-y-auto md:pl-1 md:pr-1">
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
                        {statusFilter === "All"
                          ? "No applications yet"
                          : `No applications with status "${statusFilter}"`}
                      </p>
                      <p className="text-base">
                        Add your first application to start tracking every lead in one place.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
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
