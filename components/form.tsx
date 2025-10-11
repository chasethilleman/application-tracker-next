"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
    STATUS_OPTIONS,
    type ApplicationFormValues,
} from "@shared/applicationSchema";
import { useSession } from "next-auth/react";

type FormProps = {
    addApplication: (application: ApplicationFormValues) => Promise<void> | void;
};

function createInitialState(): ApplicationFormValues {
    return {
        company: "",
        jobTitle: "",
        status: "Applied",
        applicationDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        salary: "",
        link: "",
        notes: "",
    };
}

export default function Form({ addApplication }: FormProps) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated" && Boolean(session?.user);
    const [formData, setFormData] =
        useState<ApplicationFormValues>(createInitialState);

    function onChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isAuthenticated) {
            return;
        }
        try {
            await addApplication(formData);
            setFormData(createInitialState());
        } catch {
            // addApplication reports error to parent; keep form values for retry
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="p-4 border border-slate-200 dark:border-neutral-800 rounded-lg col-span-1 bg-white dark:bg-neutral-900 text-left transition-colors h-auto space-y-3"
        >
            {!isAuthenticated && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Sign in to add new applications.
                </p>
            )}
            <fieldset
                disabled={!isAuthenticated}
                className="flex flex-col gap-2"
            >
                <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Company
                </label>
                <input
                    type="text"
                    name="company"
                    id="company"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Company"
                    value={formData.company}
                    onChange={onChange}
                    required
                />
                <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Job Title
                </label>
                <input
                    type="text"
                    name="jobTitle"
                    id="jobTitle"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={onChange}
                    required
                />
                <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Status
                </label>
                <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={onChange}
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <label
                    htmlFor="applicationDate"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Application Date
                </label>
                <input
                    type="date"
                    name="applicationDate"
                    id="applicationDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.applicationDate}
                    onChange={onChange}
                    required
                />
                <label
                    htmlFor="salary"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Salary
                </label>
                <input
                    type="number"
                    name="salary"
                    id="salary"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Salary"
                    value={formData.salary}
                    onChange={onChange}
                />
                <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Notes
                </label>
                <textarea
                    name="notes"
                    id="notes"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={onChange}
                ></textarea>
                <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                    Application Link
                </label>
                <input
                    type="url"
                    name="link"
                    id="link"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Application Link"
                    value={formData.link}
                    onChange={onChange}
                />
                <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Add Application
                </button>
            </fieldset>
        </form>
    );
}
