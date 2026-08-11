export const dynamic = "force-dynamic";

import OtpVerifyForm from "@/src/components/tickets/OtpVerifyForm";
import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import { Suspense } from "react";

export const metadata = {
    title: "Ticket Registration | Awesome Sauce Events"
};

export default async function VerifyPage({ params }: { params: Promise<{ eventSlug: string }> }) {
    const { eventSlug } = await params;

    return (
        <MainLayout>
            <Section headerText="Verify Email" sectionBackground={2}>
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header text-center"><h3>We&apos;ve sent a verification code to your email.<br />Please enter it below to continue your registration.</h3></div>
                            <div className="card-body center text-center">
                                <p className="text-center text-muted">(if you don&apos;t receive an email shortly, please check your spam folder)</p>
                                <Suspense fallback={<div>Loading verification form...</div>}>
                                    <OtpVerifyForm event={eventSlug} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </MainLayout>
    );
}
