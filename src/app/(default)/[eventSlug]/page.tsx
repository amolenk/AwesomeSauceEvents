export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import EmailForm from "@/src/components/tickets/EmailForm";
import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import { admittoRequest, eventPath, PartnerTicketedEventDetailsDto, PublicTicketTypeDto } from "@/src/lib/admitto.server";

export const metadata = {
    title: "Tickets | Awesome Sauce Events"
};

export default async function TicketsPage({
    params
}: {
    params: Promise<{ eventSlug: string }>
}) {
    const { eventSlug } = await params;

    let event: PartnerTicketedEventDetailsDto;
    let ticketTypes: PublicTicketTypeDto[];
    try {
        [event, ticketTypes] = await Promise.all([
            admittoRequest<PartnerTicketedEventDetailsDto>(eventPath(eventSlug, "")),
            admittoRequest<PublicTicketTypeDto[]>(eventPath(eventSlug, "/ticket-types"))
        ]);
    } catch {
        notFound();
    }

    // Completely sold out
    if (ticketTypes.length > 0 && ticketTypes.every(t => t.status !== "available")) {
        return (
            <MainLayout>
                <Section headerText="Tickets" subText={event.name} sectionBackground={2}>
                    <div className="row lead text-light text-center">
                        <p>All tickets are sold out.</p>
                    </div>
                </Section>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Section headerText="Tickets" subText={event.name} sectionBackground={2}>
                <div className="row justify-content-center mb-5">
                    <div className="col-md-10">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header text-center"><h3>Enter your email below to get started</h3></div>
                            <div className="card-body">
                                <EmailForm event={eventSlug} />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </MainLayout>
    );
}
