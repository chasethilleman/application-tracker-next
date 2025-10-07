import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ErrorResponse = { message: string };

export async function DELETE(
    _request: NextRequest,
    context: { params: { id?: string } }
) {
    const id = context.params.id;

    if (typeof id !== "string" || id.trim().length === 0) {
        return NextResponse.json<ErrorResponse>(
            { message: "Invalid application id" },
            { status: 400 }
        );
    }

    try {
        await prisma.application.delete({ where: { id } });
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
