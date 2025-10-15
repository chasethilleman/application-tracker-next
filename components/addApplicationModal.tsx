"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { X } from "lucide-react";
import {
    STATUS_OPTIONS,
    type ApplicationFormValues,
} from "@shared/applicationSchema";
import { useSession } from "next-auth/react";
import clsx from "clsx";

const SALARY_FORMATTER = new Intl.NumberFormat("en-US");
const ANIMATION_DURATION_MS = 220;

type AddApplicationModalProps = {
    open: boolean;
    onClose: () => void;
    addApplication: (values: ApplicationFormValues) => Promise<void> | void;
};

function createInitialState(): ApplicationFormValues {
    return {
        company: "",
        jobTitle: "",
        status: "Applied",
        applicationDate: new Date().toISOString().split("T")[0],
        salary: "",
        link: "",
        notes: "",
    };
}

export default function AddApplicationModal({
    open,
    onClose,
    addApplication,
}: AddApplicationModalProps) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated" && Boolean(session?.user);

    const [formData, setFormData] =
        useState<ApplicationFormValues>(createInitialState);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shouldRender, setShouldRender] = useState(open);
    const [animationState, setAnimationState] =
        useState<"enter" | "exit">("exit");

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            setFormData(createInitialState());
        }
    }, [open]);

    useEffect(() => {
        if (!shouldRender) {
            return;
        }

        if (open) {
            setError(null);
            setAnimationState("exit");
            const raf = requestAnimationFrame(() =>
                setAnimationState("enter")
            );
            return () => cancelAnimationFrame(raf);
        }

        setAnimationState("exit");
        const timeout = setTimeout(
            () => setShouldRender(false),
            ANIMATION_DURATION_MS
        );
        return () => clearTimeout(timeout);
    }, [open, shouldRender]);

    if (!shouldRender) return null;

    function onChange(
        event:
            | ChangeEvent<HTMLInputElement>
            | ChangeEvent<HTMLSelectElement>
            | ChangeEvent<HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;
        if (name === "salary") {
            const digitsOnly = value.replace(/[^\d]/g, "");
            setFormData((prev) => ({ ...prev, salary: digitsOnly }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isAuthenticated) {
            setError("You must be signed in to add applications.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await addApplication(formData);
            onClose();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to add application";
            setError(message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 flex h-full w-full flex-col bg-black/60 transition-opacity duration-200",
                animationState === "enter" ? "opacity-100" : "opacity-0"
            )}
        >
            <div
                className={clsx(
                    "flex h-full w-full flex-col bg-white shadow-xl transition-transform duration-200 dark:bg-neutral-900",
                    animationState === "enter"
                        ? "translate-y-0"
                        : "translate-y-full"
                )}
            >
                <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-neutral-800">
                    <div className="flex flex-col">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Add Application
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Track a new job opportunity.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-slate-300 dark:hover:bg-neutral-800"
                        aria-label="Close add application modal"
                    >
                        <X className="h-4 w-4" aria-hidden />
                    </button>
                </header>
                <form onSubmit={onSubmit} className="flex h-full flex-col">
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        {!isAuthenticated && (
                            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                                Sign in to create applications.
                            </p>
                        )}
                        <fieldset
                            disabled={!isAuthenticated}
                            className="flex flex-col gap-3"
                        >
                            <label
                                htmlFor="company"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Company
                            </label>
                            <input
                                type="text"
                                name="company"
                                id="company"
                                className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Company name"
                                value={formData.company}
                                onChange={onChange}
                                required
                            />
                            <label
                                htmlFor="jobTitle"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Job Title
                            </label>
                            <input
                                type="text"
                                name="jobTitle"
                                id="jobTitle"
                                className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Job title"
                                value={formData.jobTitle}
                                onChange={onChange}
                                required
                            />
                            <label
                                htmlFor="status"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={onChange}
                                className="appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <label
                                htmlFor="applicationDate"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Application Date
                            </label>
                            <input
                                type="date"
                                name="applicationDate"
                                id="applicationDate"
                                className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={formData.applicationDate}
                                onChange={onChange}
                                required
                            />
                            <label
                                htmlFor="salary"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Salary
                            </label>
                            <input
                                type="text"
                                name="salary"
                                id="salary"
                                inputMode="numeric"
                                className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Expected salary"
                                value={
                                    formData.salary.length > 0
                                        ? SALARY_FORMATTER.format(
                                              Number(formData.salary)
                                          )
                                        : ""
                                }
                                onChange={onChange}
                            />
                            <label
                                htmlFor="link"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Application Link
                            </label>
                            <input
                                type="url"
                                name="link"
                                id="link"
                                className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="https://"
                                value={formData.link}
                                onChange={onChange}
                            />
                            <label
                                htmlFor="notes"
                                className="text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                id="notes"
                                className="h-28 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Any additional details…"
                                value={formData.notes}
                                onChange={onChange}
                            />
                        </fieldset>
                        {error && (
                            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-4 py-3 dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={saving || !isAuthenticated}
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
