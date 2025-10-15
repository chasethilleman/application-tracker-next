"use client";

import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    STATUS_OPTIONS,
    type ApplicationFormValues,
    type ApplicationRecord,
} from "@shared/applicationSchema";

const SALARY_FORMATTER = new Intl.NumberFormat("en-US");

type EditApplicationModalProps = {
    open: boolean;
    application: ApplicationRecord;
    onClose: () => void;
    onSave: (values: ApplicationFormValues) => Promise<void>;
};

function buildInitialState(
    application: ApplicationRecord
): ApplicationFormValues {
    return {
        company: application.company,
        jobTitle: application.jobTitle,
        status: application.status,
        applicationDate: application.applicationDate,
        salary: application.salary.replace(/[^\d]/g, ""),
        link: application.link,
        notes: application.notes,
    };
}

export default function EditApplicationModal({
    open,
    application,
    onClose,
    onSave,
}: EditApplicationModalProps) {
    const initialState = useMemo(
        () => buildInitialState(application),
        [application]
    );
    const [formData, setFormData] =
        useState<ApplicationFormValues>(initialState);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(initialState);
    }, [initialState]);

    if (!open) return null;

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
        setSaving(true);
        setError(null);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to update application";
            setError(message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-xl rounded-lg bg-white shadow-lg dark:bg-neutral-900">
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="border-b border-slate-200 px-6 py-4 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Edit Application
                        </h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Update details for {application.company}.
                        </p>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-2 space-y-3">
                        <label
                            htmlFor="company"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Company
                        </label>
                        <input
                            type="text"
                            name="company"
                            id="company"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={formData.company}
                            onChange={onChange}
                            required
                        />
                        <label
                            htmlFor="jobTitle"
                            className="mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="jobTitle"
                            id="jobTitle"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={formData.jobTitle}
                            onChange={onChange}
                            required
                        />
                        <label
                            htmlFor="status"
                            className="mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Status
                        </label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={onChange}
                            className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <label
                            htmlFor="applicationDate"
                            className="mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Application Date
                        </label>
                        <input
                            type="date"
                            name="applicationDate"
                            id="applicationDate"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={formData.applicationDate}
                            onChange={onChange}
                            required
                        />
                        <label
                            htmlFor="salary"
                            className="mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Salary
                        </label>
                        <input
                            type="text"
                            name="salary"
                            id="salary"
                            inputMode="numeric"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={
                                formData.salary.length > 0
                                    ? SALARY_FORMATTER.format(Number(formData.salary))
                                    : ""
                            }
                            onChange={onChange}
                        />
                        <label
                            htmlFor="link"
                            className="mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Application Link
                        </label>
                        <input
                            type="url"
                            name="link"
                            id="link"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={formData.link}
                            onChange={onChange}
                        />
                        <label
                            htmlFor="notes"
                            className="mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            id="notes"
                            className="h-24 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={formData.notes}
                            onChange={onChange}
                        />
                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-neutral-800">
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
                            disabled={saving}
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
