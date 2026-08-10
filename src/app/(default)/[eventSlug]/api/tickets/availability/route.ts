import { admittoRequest, eventPath, PartnerTicketedEventDetailsDto, PublicTicketTypeDto, toProblemResponse } from "@/src/lib/admitto.server";

export async function GET(
    _req: Request,
    context: { params: Promise<{ eventSlug: string }> }
) {
    try {
        const { eventSlug } = await context.params;

        const [event, ticketTypes] = await Promise.all([
            admittoRequest<PartnerTicketedEventDetailsDto>(eventPath(eventSlug, "")),
            admittoRequest<PublicTicketTypeDto[]>(eventPath(eventSlug, "/ticket-types"))
        ]);

        return Response.json({
            eventName: event.name,
            ticketTypes: ticketTypes.map(ticketType => ({
                id: ticketType.id,
                name: ticketType.name,
                timeSlots: ticketType.timeSlots,
                status: ticketType.status,
                hasCapacity: ticketType.status === "available"
            })),
            additionalFields: event.additionalDetailFields
        });
    } catch (error) {
        return toProblemResponse(error);
    }
}
