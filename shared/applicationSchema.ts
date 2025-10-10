export const STATUS_OPTIONS = [
    "Applied",
    "Interviewing",
    "Offered",
    "Rejected",
] as const;

export type ApplicationStatus = (typeof STATUS_OPTIONS)[number];

export type ApplicationFormValues = {
    company: string;
    jobTitle: string;
    status: ApplicationStatus;
    applicationDate: string;
    salary: string;
    link: string;
    notes: string;
};

export type ApplicationRecord = ApplicationFormValues & {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};
