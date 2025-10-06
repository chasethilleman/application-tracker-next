import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
    STATUS_OPTIONS,
    type ApplicationFormValues,
    type ApplicationRecord,
    type ApplicationStatus,
} from "@shared/applicationSchema";

type ErrorResponse = { message: string };
type SuccessResponse = ApplicationRecord | ApplicationRecord[];

function isApplicationStatus(value: string): value is ApplicationStatus {
    return (STATUS_OPTIONS as readonly string[]).includes(value);
}

function isApplicationPayload(
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
        !requiredFields.every(
            (field) => typeof record[field] === "string"
        )
    ) {
        return false;
    }

    return isApplicationStatus(record.status as string);
}

function toNullable(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
}

function toApplicationRecord(application: {
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
}): ApplicationRecord {
    return {
        id: application.id,
        company: application.company,
        jobTitle: application.jobTitle,
        status: application.status,
        applicationDate: application.applicationDate.toISOString().split("T")[0],
        salary: application.salary ?? "",
        link: application.link ?? "",
        notes: application.notes ?? "",
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
    };
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
    if (req.method === "GET") {
        try {
            const applications = await prisma.application.findMany({
                orderBy: { createdAt: "desc" },
            });
            return res
                .status(200)
                .json(
                    applications.map(
                        (app: {
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
                        }) => toApplicationRecord(app)
                    )
                );
        } catch (error) {
            console.error("Failed to load applications", error);
            return res
                .status(500)
                .json({ message: "Failed to load applications" });
        }
    }

    if (req.method === "POST") {
        if (!isApplicationPayload(req.body)) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const applicationDate = new Date(req.body.applicationDate);
        if (Number.isNaN(applicationDate.getTime())) {
            return res.status(400).json({ message: "Invalid application date" });
        }

        try {
            const created = await prisma.application.create({
                data: {
                    company: req.body.company.trim(),
                    jobTitle: req.body.jobTitle.trim(),
                    status: req.body.status,
                    applicationDate,
                    salary: toNullable(req.body.salary),
                    link: toNullable(req.body.link),
                    notes: toNullable(req.body.notes),
                },
            });

            return res.status(201).json(toApplicationRecord(created));
        } catch (error) {
            console.error("Failed to create application", error);
            return res
                .status(500)
                .json({ message: "Failed to create application" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res
        .status(405)
        .json({ message: `Method ${req.method ?? "UNKNOWN"} Not Allowed` });
}
