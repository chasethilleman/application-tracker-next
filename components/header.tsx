import { ScrollText, Check, BadgeCheck, X, Calendar } from "lucide-react";
import JobsyBlack from "../assets/jobsy-black.png";
import JobsyWhite from "../assets/jobsy-white.png";

type HeaderProps = {
    totalApplications: number;
    appliedApplications: number;
    interviewingApplications: number;
    offeredApplications: number;
    rejectedApplications: number;
};

function HeaderCard(props: { title: string; count: number }) {
    return (
        <>
            <div className="header-card justify-between">
                <img src={JobsyBlack.src} alt="Jobsy Logo" className="h-8 w-auto" />
            </div>
            <div className="border border-slate-200 dark:border-neutral-800 rounded-lg p-4 text-center w-full md:flex-1 min-w-0 bg-white dark:bg-neutral-900 transition-colors">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {props.title}
                    </p>
                    {props.title === "Total Applications" ? (
                        <>
                            <span className="text-blue-800 dark:text-blue-300 text-xs font-semibold">
                                <ScrollText className="h-4 w-4" aria-hidden />
                            </span>
                        </>
                    ) : props.title === "Applied" ? (
                        <>
                            <span className="text-blue-800 dark:text-blue-300 text-xs font-semibold">
                                <Check className="h-4 w-4" aria-hidden />
                            </span>
                        </>
                    ) : props.title === "Interviewing" ? (
                        <>
                            <span className="text-yellow-800 dark:text-yellow-200 text-xs font-semibold">
                                <Calendar className="h-4 w-4" aria-hidden />
                            </span>
                        </>
                    ) : props.title === "Offered" ? (
                        <>
                            <span className="text-green-800 dark:text-green-300 text-xs font-semibold">
                                <BadgeCheck className="h-4 w-4" aria-hidden />
                            </span>
                        </>
                    ) : props.title === "Rejected" ? (
                        <>
                            <span className="text-red-800 dark:text-red-300 text-xs font-semibold">
                                <X className="h-4 w-4" aria-hidden />
                            </span>
                        </>
                    ) : null}
                </div>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {props.count}
                </h1>
            </div>
        </>
    );
}

export default function Header({
    totalApplications,
    appliedApplications,
    interviewingApplications,
    offeredApplications,
    rejectedApplications,
}: HeaderProps) {
    return (
        <header className="header pt-4 pb-4 border-b border-slate-200 dark:border-neutral-800 mb-4 bg-white dark:bg-neutral-900 sticky top-0 z-10 transition-colors">
            <div className="stats flex flex-col gap-4 md:flex-row">
                <HeaderCard title="Total Applications" count={totalApplications} />
                <HeaderCard title="Applied" count={appliedApplications} />
                <HeaderCard title="Interviewing" count={interviewingApplications} />
                <HeaderCard title="Offered" count={offeredApplications} />
                <HeaderCard title="Rejected" count={rejectedApplications} />
            </div>
        </header>
    );
}
