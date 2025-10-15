"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

const ANIMATION_DURATION_MS = 180;

type ConfirmDeleteModalProps = {
    open: boolean;
    company: string;
    jobTitle: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
};

export default function ConfirmDeleteModal({
    open,
    company,
    jobTitle,
    onClose,
    onConfirm,
}: ConfirmDeleteModalProps) {
    const [shouldRender, setShouldRender] = useState(open);
    const [animationState, setAnimationState] =
        useState<"enter" | "exit">("exit");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
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

    async function handleConfirm() {
        try {
            setSubmitting(true);
            setError(null);
            await onConfirm();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to delete application";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200",
                animationState === "enter" ? "opacity-100" : "opacity-0"
            )}
        >
            <div
                className={clsx(
                    "w-full max-w-md rounded-lg bg-white shadow-lg dark:bg-neutral-900 transform transition-all duration-200",
                    animationState === "enter"
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-4 scale-95 opacity-0"
                )}
            >
                <div className="px-6 pt-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Delete Application
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Are you sure you want to remove the application for{" "}
                        <span className="font-medium">{jobTitle}</span> at{" "}
                        <span className="font-medium">{company}</span>? This action
                        cannot be undone.
                    </p>
                    {error && (
                        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </div>
                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-neutral-800">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="cursor-pointer inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={submitting}
                    >
                        {submitting ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
