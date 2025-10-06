"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import Form from "../components/form";
import ApplicationCard from "../components/applicationCard";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import type {
  ApplicationFormValues,
  ApplicationRecord,
} from "@shared/applicationSchema";

export default function Home() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) {
          throw new Error("Failed to load applications");
        }
        const data = (await response.json()) as ApplicationRecord[];
        setApplications(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load applications";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadApplications();
  }, []);

  async function addApplication(application: ApplicationFormValues) {
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

  return (
    <div className="min-w-screen min-h-screen bg-white text-slate-900 dark:bg-neutral-900 dark:text-white transition-colors">
      <div className="min-h-screen bg-white text-slate-900 dark:bg-neutral-900 dark:text-white transition-colors max-w-7xl mx-auto p-8">
        {confetti && <Fireworks autorun={{ speed: 3, duration: 3000 }} />}
        <Header
          totalApplications={totalApplications}
          appliedApplications={appliedApplications}
          interviewingApplications={interviewingApplications}
          offeredApplications={offeredApplications}
          rejectedApplications={rejectedApplications}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <Form addApplication={addApplication} />
          <div className="applications-list col-span-2">
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-slate-600 dark:text-slate-300">
                <div
                  className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                  role="status"
                  aria-label="Loading applications"
                />
                <p>Loading applications…</p>
              </div>
            )}
            {applications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {applications.map((application, index) => (
                  <ApplicationCard
                    key={`${application.company}-${application.applicationDate}-${index}`}
                    {...application}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-300 text-center">
                No applications found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
