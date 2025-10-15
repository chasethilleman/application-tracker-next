import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import {
    isApplicationPayload,
    toApplicationRecord,
    toNullable,
} from "../utils";
import type { ApplicationRecord } from "@shared/applicationSchema";

type ErrorResponse = { message: string };

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id || id.trim().length === 0) {
        return NextResponse.json<ErrorResponse>(
            { message: "Invalid application id" },
            { status: 400 }
        );
    }

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json<ErrorResponse>(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const result = await prisma.application.deleteMany({
            where: { id, userId: session.user.id },
        });

        if (result.count === 0) {
            return NextResponse.json<ErrorResponse>(
                { message: "Application not found" },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json<ErrorResponse>(
                { message: "Application not found" },
                { status: 404 }
            );
        }

        console.error(`Failed to delete application ${id}`, error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to delete application" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id || id.trim().length === 0) {
        return NextResponse.json<ErrorResponse>(
            { message: "Invalid application id" },
            { status: 400 }
        );
    }

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json<ErrorResponse>(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json<ErrorResponse>(
            { message: "Invalid request body" },
            { status: 400 }
        );
    }

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
        const result = await prisma.application.updateMany({
            where: { id, userId: session.user.id },
            data: {
                company: body.company.trim(),
                jobTitle: body.jobTitle.trim(),
                status: body.status,
                applicationDate,
                salary: toNullable(body.salary),
                link: toNullable(body.link),
                notes: toNullable(body.notes),
            },
        });

        if (result.count === 0) {
            return NextResponse.json<ErrorResponse>(
                { message: "Application not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.application.findUnique({
            where: { id },
        });

        if (!updated) {
            return NextResponse.json<ErrorResponse>(
                { message: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json<ApplicationRecord>(
            toApplicationRecord(updated)
        );
    } catch (error) {
        console.error(`Failed to update application ${id}`, error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to update application" },
            { status: 500 }
        );
    }
}

export const runtime = "nodejs";
