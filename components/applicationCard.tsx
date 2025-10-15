"use client";

import { useState, type CSSProperties } from "react";
import type {
    ApplicationFormValues,
    ApplicationRecord,
} from "@shared/applicationSchema";
import clsx from "clsx";
import {
    Briefcase,
    Calendar,
    DollarSign,
    Link,
    FileText,
    Trash2,
    Pencil
} from "lucide-react";
import EditApplicationModal from "./editApplicationModal";

type ApplicationCardProps = ApplicationRecord & {
    deleteApplication: () => Promise<void>;
    updateApplication: (
        id: string,
        values: ApplicationFormValues
    ) => Promise<ApplicationRecord | void>;
    animationDelay?: number;
};

export default function ApplicationCard(props: ApplicationCardProps) {
    const {
        deleteApplication,
        updateApplication,
        animationDelay,
        ...application
    } = props;

    const formattedSalary =
        application.salary.trim().length > 0
            ? Number.isNaN(Number(application.salary))
                ? application.salary
                : Number(application.salary).toLocaleString()
            : "—";
    const animationStyle: CSSProperties | undefined =
        animationDelay !== undefined
            ? { animationDelay: `${animationDelay}ms` }
            : undefined;

    const [isEditing, setIsEditing] = useState(false);
    function handleOpenEdit() {
        setIsEditing(true);
    }

    async function handleDelete() {
        if (
            confirm(
                `Are you sure you want to delete the application to ${application.company}? This action cannot be undone.`
            )
        ) {
            try {
                await deleteApplication();
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unable to delete application";
                alert(message);
            }
        }
    }

    async function handleSave(values: ApplicationFormValues) {
        try {
            await updateApplication(application.id, values);
        } catch (err) {
            throw err;
        }
    }

    return (
        <>
            <div
                className="application-card border border-slate-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 shadow text-left hover:shadow-lg transition-colors transition-shadow duration-300 card-slide-in"
                style={animationStyle}
            >
                <div className="flex items-start justify-between pb-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {application.company}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleOpenEdit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-slate-300 dark:hover:bg-neutral-800/70"
                            aria-label={`Edit application to ${application.company}`}
                        >
                            <Pencil className="mr-2 h-4 w-4" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            aria-label={`Delete application to ${application.company}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40"
                        >
                            <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                </div>
                <p
                    className={clsx(
                        "inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 transition-colors",
                        application.status === "Applied" &&
                        "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
                        application.status === "Interviewing" &&
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        application.status === "Offered" &&
                        "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
                        application.status === "Rejected" &&
                        "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
                        !["Applied", "Interviewing", "Offered", "Rejected"].includes(
                            application.status
                        ) &&
                        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    )}
                >
                    {application.status}
                </p>
                <p className="flex items-center py-1 text-slate-600 dark:text-slate-300">
                    <Briefcase
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {application.jobTitle}
                </p>
                <p className="flex items-center py-1 text-slate-600 dark:text-slate-300">
                    <Calendar
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {application.applicationDate}
                </p>
                <p className="flex items-center py-1 text-slate-600 dark:text-slate-300">
                    <DollarSign
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {formattedSalary}
                </p>
                <p className="flex items-center py-1 break-all text-slate-600 dark:text-slate-300">
                    <Link
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {application.link ? (
                        <a
                            href={application.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                        >
                            Link to Posting
                        </a>
                    ) : (
                        "No link provided"
                    )}
                </p>
                <p className="flex items-start py-1 text-slate-600 dark:text-slate-300">
                    <FileText
                        className="mr-2 mt-1 min-h-4 min-w-4 max-h-4 max-w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {application.notes}
                </p>
            </div>
            <EditApplicationModal
                open={isEditing}
                application={application}
                onClose={() => setIsEditing(false)}
                onSave={handleSave}
            />
        </>
    );
}
