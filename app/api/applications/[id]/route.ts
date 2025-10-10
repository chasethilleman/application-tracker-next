import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

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

export const runtime = "nodejs";
