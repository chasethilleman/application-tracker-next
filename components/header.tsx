"use client";

import Image from "next/image";
import clsx from "clsx";
import {
    ScrollText,
    Check,
    BadgeCheck,
    X,
    Calendar,
    Plus,
    type LucideIcon,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import JobsyBlack from "../assets/jobsy-black.png";
import JobsyWhite from "../assets/jobsy-white.png";

type HeaderProps = {
    totalApplications: number;
    appliedApplications: number;
    interviewingApplications: number;
    offeredApplications: number;
    rejectedApplications: number;
    onAddApplication: () => void;
};

const HEADER_CARD_META = {
    "Total Applications": {
        icon: ScrollText,
        colorClass: "text-blue-800 dark:text-blue-300",
    },
    Applied: {
        icon: Check,
        colorClass: "text-blue-800 dark:text-blue-300",
    },
    Interviewing: {
        icon: Calendar,
        colorClass: "text-yellow-800 dark:text-yellow-200",
    },
    Offered: {
        icon: BadgeCheck,
        colorClass: "text-green-800 dark:text-green-300",
    },
    Rejected: {
        icon: X,
        colorClass: "text-red-800 dark:text-red-300",
    },
} as const;

type HeaderCardTitle = keyof typeof HEADER_CARD_META;

type HeaderCardProps = {
    title: HeaderCardTitle;
    count: number;
};

const GOOGLE_ICON_SRC = "/google-icon.svg";

function HeaderCard({ title, count }: HeaderCardProps) {
    const meta = HEADER_CARD_META[title];
    const Icon: LucideIcon = meta.icon;

    return (
        <div className="h-full min-w-0 flex-1 shrink md:min-w-0 md:flex-none">
            <div className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-800 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-slate-100 md:hidden">
                <Icon className={clsx("h-4 w-4", meta.colorClass)} aria-hidden />
                <span className="text-sm font-semibold">{count}</span>
                <span className="sr-only">{title}</span>
            </div>
            <div className="hidden h-full rounded-lg border border-slate-200 bg-white p-4 text-center transition-colors dark:border-neutral-800 dark:bg-neutral-900 md:flex md:flex-col">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {title}
                    </p>
                    <Icon
                        className={clsx("h-4 w-4", meta.colorClass)}
                        aria-hidden
                    />
                </div>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {count}
                </p>
            </div>
        </div>
    );
}

export default function Header({
    totalApplications,
    appliedApplications,
    interviewingApplications,
    offeredApplications,
    rejectedApplications,
    onAddApplication,
}: HeaderProps) {
    const { data: session, status } = useSession();
    const isLoadingSession = status === "loading";
    const isAuthenticated = status === "authenticated" && Boolean(session?.user);
    const userDisplayName =
        session?.user?.name ??
        session?.user?.email ??
        (isAuthenticated ? "Signed in" : null);

    function handleAuthAction() {
        if (isAuthenticated) {
            void signOut();
        } else {
            void signIn("google");
        }
    }

    return (
        <header className="header sticky top-0 z-10 w-full bg-white transition-colors dark:bg-neutral-900 mb-4">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="border-b border-slate-200 pb-4 dark:border-neutral-800">
                    <div className="header-card flex items-center justify-between">
                        <div className="flex items-center">
                            <Image
                                src={JobsyBlack}
                                alt="Jobsy Logo"
                                className={clsx("h-16 w-auto", "dark:hidden")}
                                priority
                            />
                            <Image
                                src={JobsyWhite}
                                alt="Jobsy Logo"
                                className={clsx("hidden h-16 w-auto", "dark:block")}
                                priority
                            />
                        </div>
                        <div className="flex max-w-xs flex-col items-stretch gap-2 md:hidden">
                            {userDisplayName && (
                                <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                                    {userDisplayName}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleAuthAction}
                                disabled={isLoadingSession}
                                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoadingSession
                                    ? "Checking…"
                                    : isAuthenticated
                                        ? "Sign out"
                                        : (
                                            <>
                                                <Image
                                                    src={GOOGLE_ICON_SRC}
                                                    alt="Google logo"
                                                    width={18}
                                                    height={18}
                                                    className="h-4 w-4"
                                                />
                                                <span>Sign in with Google</span>
                                            </>
                                        )}
                            </button>
                        </div>
                        <div className="hidden items-center gap-3 md:flex">
                            {userDisplayName && (
                                <span className="max-w-[12rem] truncate text-sm text-slate-600 dark:text-slate-300">
                                    {userDisplayName}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleAuthAction}
                                disabled={isLoadingSession}
                                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoadingSession
                                    ? "Checking…"
                                    : isAuthenticated
                                        ? "Sign out"
                                        : (
                                            <>
                                                <Image
                                                    src={GOOGLE_ICON_SRC}
                                                    alt="Google logo"
                                                    width={18}
                                                    height={18}
                                                    className="h-4 w-4"
                                                />
                                                <span>Sign in with Google</span>
                                            </>
                                        )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="stats mt-6 flex flex-nowrap gap-2 overflow-hidden md:grid md:grid-cols-5 md:gap-3 md:overflow-visible">
                    <HeaderCard title="Total Applications" count={totalApplications} />
                    <HeaderCard title="Applied" count={appliedApplications} />
                    <HeaderCard title="Interviewing" count={interviewingApplications} />
                    <HeaderCard title="Offered" count={offeredApplications} />
                    <HeaderCard title="Rejected" count={rejectedApplications} />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        if (isAuthenticated) {
                            onAddApplication();
                        } else if (!isLoadingSession) {
                            void signIn("google");
                        }
                    }}
                    disabled={isLoadingSession}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900 md:hidden"
                >
                    {isAuthenticated ? (
                        <>
                            <Plus className="h-4 w-4" aria-hidden />
                            Add Application
                        </>
                    ) : (
                        <>
                            <Image
                                src={GOOGLE_ICON_SRC}
                                alt="Google logo"
                                width={18}
                                height={18}
                                className="h-4 w-4"
                            />
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-slate-200 dark:bg-neutral-800" />
            </div>
        </header>
    );
}
