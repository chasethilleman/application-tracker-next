import {
    STATUS_OPTIONS,
    type ApplicationFormValues,
    type ApplicationRecord,
    type ApplicationStatus,
} from "@shared/applicationSchema";

export function isApplicationStatus(value: string): value is ApplicationStatus {
    return (STATUS_OPTIONS as readonly string[]).includes(value);
}

export function isApplicationPayload(
    payload: unknown
): payload is ApplicationFormValues {
    if (payload === null || typeof payload !== "object") {
        return false;
    }

    const record = payload as Record<string, unknown>;
    const requiredFields: Array<keyof ApplicationFormValues> = [
        "company",
        "jobTitle",
        "status",
        "applicationDate",
        "salary",
        "link",
        "notes",
    ];

    if (
        !requiredFields.every((field) => typeof record[field] === "string")
    ) {
        return false;
    }

    return isApplicationStatus(record.status as string);
}

export function toNullable(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
}

type PrismaApplication = {
    id: string;
    company: string;
    jobTitle: string;
    status: ApplicationStatus;
    applicationDate: Date;
    salary: string | null;
    link: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
};

export function toApplicationRecord(
    application: PrismaApplication
): ApplicationRecord {
    return {
        id: application.id,
        company: application.company,
        jobTitle: application.jobTitle,
        status: application.status,
        applicationDate: application.applicationDate
            .toISOString()
            .split("T")[0],
        salary: application.salary ?? "",
        link: application.link ?? "",
        notes: application.notes ?? "",
        userId: application.userId,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
    };
}
