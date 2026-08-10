import { admittoRequest, eventPath, toProblemResponse } from "@/src/lib/admitto.server";

export async function POST(
    req: Request,
    context: { params: Promise<{ eventSlug: string; registrationId: string }> }
) {
    try {
        const { eventSlug, registrationId } = await context.params;
        await admittoRequest<void>(eventPath(eventSlug, `/registrations/${encodeURIComponent(registrationId)}/cancel`), {
            method: "POST"
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        return toProblemResponse(error);
    }
}
