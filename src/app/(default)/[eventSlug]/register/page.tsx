export const dynamic = "force-dynamic";

import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import RegisterForm from "@/src/components/tickets/RegisterForm";

export const metadata = {
    title: "Ticket Registration | Awesome Sauce Events"
};

export default async function RegisterPage({
    params,
    searchParams,
}: {
    params: Promise<{ eventSlug: string }>;
    searchParams: Promise<{ email?: string; token?: string; }>
}) {
    const { eventSlug } = await params;
    const { email, token } = await searchParams;

    return (
        <MainLayout>
            <Section headerText="Registration" sectionBackground={2}>
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-9">
                        <RegisterForm event={eventSlug} email={email ?? ""} token={token ?? ""} />
                    </div>
                </div>
            </Section>
        </MainLayout>
    );
}
