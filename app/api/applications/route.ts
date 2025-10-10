import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
    STATUS_OPTIONS,
    type ApplicationFormValues,
    type ApplicationRecord,
    type ApplicationStatus,
} from "@shared/applicationSchema";
import { auth } from "@/auth";

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
    userId: string;
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
        userId: application.userId,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
    };
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const applications = await prisma.application.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json<SuccessResponse>(
            applications.map((app) => toApplicationRecord(app))
        );
    } catch (error) {
        console.error("Failed to load applications", error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to load applications" },
            { status: 500 }
        );
    }
}

async function parseRequestBody(req: NextRequest) {
    try {
        return await req.json();
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    const body = await parseRequestBody(req);
    const session = await auth();

    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!isApplicationPayload(body)) {
        return NextResponse.json<ErrorResponse>(
            { message: "Invalid request body" },
            { status: 400 }
        );
    }

    const applicationDate = new Date(body.applicationDate);
    if (Number.isNaN(applicationDate.getTime())) {
        return NextResponse.json<ErrorResponse>(
            { message: "Invalid application date" },
            { status: 400 }
        );
    }

    try {
        const created = await prisma.application.create({
            data: {
                company: body.company.trim(),
                jobTitle: body.jobTitle.trim(),
                status: body.status,
                applicationDate,
                salary: toNullable(body.salary),
                link: toNullable(body.link),
                notes: toNullable(body.notes),
                userId: session.user.id,
            },
        });

        return NextResponse.json<SuccessResponse>(
            toApplicationRecord(created),
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create application", error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to create application" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json<ErrorResponse>(
            { message: "Missing application ID" },
            { status: 400 }
        );
    }

    try {
        await prisma.application.delete({
            where: { id },
        });

        return NextResponse.json<SuccessResponse>({} as ApplicationRecord, {
            status: 204,
        });
    } catch (error) {
        console.error("Failed to delete application", error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to delete application" },
            { status: 500 }
        );
    }
}

export const runtime = "nodejs";
