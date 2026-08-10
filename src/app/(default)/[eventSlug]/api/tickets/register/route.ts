import { admittoRequest, eventPath, toProblemResponse } from "@/src/lib/admitto.server";

export async function POST(
    req: Request,
    context: { params: Promise<{ eventSlug: string }> }
) {
    try {
        const { eventSlug } = await context.params;
        const body = await req.json();
        await admittoRequest<void>(eventPath(eventSlug, "/registrations"), {
            method: "POST",
            token: body.registrationToken,
            body: {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                registerTicketTypeIds: body.ticketTypeIds || [],
                waitlistTicketTypeIds: body.waitlistTicketTypeIds || [],
                additionalDetails: body.additionalDetails || null
            }
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        return toProblemResponse(error);
    }
}
