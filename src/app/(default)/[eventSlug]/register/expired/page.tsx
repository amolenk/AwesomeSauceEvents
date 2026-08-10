import Section from "@/src/components/layout/Section";
import MainLayout from "@/src/components/layout/MainLayout";
import { eventRoute } from "@/src/utils/event-routes";

export const metadata = {
    title: "Ticket Registration | Awesome Sauce Events"
};

export default async function TokenExpiredPage({
    params
}: {
    params: Promise<{ eventSlug: string }>
}) {
    const { eventSlug } = await params;

    return (
        <MainLayout>
            <Section headerText="Invalid Token" sectionBackground={2}>
                <div className="text-light text-center">
                    <h2>Verification Token is Invalid or Expired</h2>
                    <p className="lead mt-5">Please try registering again.</p>
                    <a href={eventRoute(eventSlug)} className="btn btn-primary mt-4">Back to Registration</a>
                </div>
            </Section>
        </MainLayout>
    );
}
