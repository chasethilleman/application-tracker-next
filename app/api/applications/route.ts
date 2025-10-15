import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { type ApplicationRecord } from "@shared/applicationSchema";
import { auth } from "@/auth";
import {
    isApplicationPayload,
    toApplicationRecord,
    toNullable,
} from "./utils";

type ErrorResponse = { message: string };
type SuccessResponse = ApplicationRecord | ApplicationRecord[];

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
