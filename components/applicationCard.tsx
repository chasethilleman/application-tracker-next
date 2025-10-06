import type { ApplicationRecord } from "@shared/applicationSchema";
import clsx from "clsx";
import {
    Building,
    Briefcase,
    Calendar,
    DollarSign,
    Link,
    FileText,
} from "lucide-react";

type ApplicationCardProps = ApplicationRecord;

export default function ApplicationCard(props: ApplicationCardProps) {
    return (
        <>
            <div className="application-card border border-slate-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 shadow text-left hover:shadow-lg transition-colors transition-shadow duration-300">
                <h2 className="text-xl font-bold flex items-center pb-2 text-slate-900 dark:text-slate-100">
                    {props.company}
                </h2>
                <p
                    className={clsx(
                        "inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 transition-colors",
                        props.status === "Applied" &&
                        "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
                        props.status === "Interviewing" &&
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        props.status === "Offered" &&
                        "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
                        props.status === "Rejected" &&
                        "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
                        !["Applied", "Interviewing", "Offered", "Rejected"].includes(
                            props.status
                        ) &&
                        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    )}
                >
                    {props.status}
                </p>
                <p className="flex items-center py-1 text-slate-600 dark:text-slate-300">
                    <Briefcase
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {props.jobTitle}
                </p>
                <p className="flex items-center py-1 text-slate-600 dark:text-slate-300">
                    <Calendar
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {props.applicationDate}
                </p>
                <p className="flex items-center py-1 text-slate-600 dark:text-slate-300">
                    <DollarSign
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />
                    {props.salary || "—"}
                </p>
                <p className="flex items-center py-1 break-all text-slate-600 dark:text-slate-300">
                    <Link
                        className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300"
                        aria-hidden
                    />{" "}
                    {props.link ? (
                        <a
                            href={props.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                        >
                            Link to Posting
                        </a>
                    ) : (
                        "No link provided"
                    )}
                </p>
                <p className="flex items-start py-1 text-slate-600 dark:text-slate-300">
                    <FileText
                        className="mr-2 min-h-4 min-w-4 max-h-4 max-w-4 text-slate-500 dark:text-slate-300 mt-1"
                        aria-hidden
                    />{" "}
                    {props.notes}
                </p>
            </div>
        </>
    );
}
