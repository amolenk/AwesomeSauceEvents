import { admittoRequest, eventPath, toProblemResponse } from "@/src/lib/admitto.server";

export async function POST(
    req: Request,
    context: { params: Promise<{ eventSlug: string }> }
) {
    try {
        const { eventSlug } = await context.params;
        const { email } = await req.json();
        await admittoRequest<void>(eventPath(eventSlug, "/otp/request"), {
            method: "POST",
            body: { email }
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        return toProblemResponse(error);
    }
}
