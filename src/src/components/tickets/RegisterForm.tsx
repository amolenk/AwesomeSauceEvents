'use client'

import React, { useRef, useState, useEffect } from "react";

import ErrorCard from "../common/ErrorCard";
import SpinningButton from "../common/SpinningButton";
import TicketSelectionForm from "./TicketSelectionForm";
import AttendeeDetailsForm, { AttendeeDetails } from "./AttendeeDetailsForm";

import { AdmittoError, getAvailability, Availability, isBeforeRegistrationOpen, isAfterRegistrationClosed, register } from "../../api/admitto";
import { AdditionalField, parseAdditionalField } from "@/src/utils/additional-fields";
import { useRouter } from "next/navigation";
import { eventRoute } from "@/src/utils/event-routes";

interface RegisterFormProps {
    event: string;
    email: string;
    token: string;
}

export default function RegisterForm({ event, email, token }: RegisterFormProps) {

    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submittingError, setSubmittingError] = useState("");
    const [availability, setAvailability] = useState<Availability | null>(null);
    const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>([]);
    const [selectedTicketTypeIds, setSelectedTicketTypeIds] = useState<string[]>([]);
    const [details, setDetails] = useState<AttendeeDetails>({
        firstName: "",
        lastName: "",
        additionalDetails: {}
    });

    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const availabilityResult = await getAvailability(event);
                setAvailability(availabilityResult);
                setAdditionalFields(availabilityResult.additionalFields.map(parseAdditionalField));
                setLoading(false);
            } catch (err: unknown) {
                setLoadingError(err instanceof Error ? err.message : "Could not fetch ticket availability.");
                setLoading(false);
            }
        }
        fetchData();
    }, [event]);

    // Redirect if email or token is missing
    useEffect(() => {
        if (email === "" || token === "") {
            router.push(eventRoute(event, "/register/expired"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmittingError("");

        try {
            await register(
                event,
                email,
                details.firstName,
                details.lastName,
                selectedTicketTypeIds,
                details.additionalDetails,
                token);

            router.push(eventRoute(event, "/register/thankyou"));
        } catch (err: unknown) {
            if (err instanceof AdmittoError && err.code === "attendee.invalid_token") {
                router.push(eventRoute(event, "/register/expired"));
            }
            else {
                setSubmitting(false);
                setSubmittingError(err instanceof Error ? err.message : "Registration failed. Please try again.");
            }
        }
    };

    const isFormValid = () =>
        (formRef.current?.checkValidity() ?? false)
        && selectedTicketTypeIds.length > 0;

    // Loading spinner
    if (loading || email === "" || token === "") {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Loading error
    if (loadingError) {
        return <ErrorCard error={loadingError} />;
    }

    // Registration not yet open
    if (availability && isBeforeRegistrationOpen(availability)) {
        return (
            <div className="card h-100 shadow-sm">
                <div className="card-header text-center"><h3>Registration is closed</h3></div>
                <div className="card-body text-center">Registration is not open yet. Please check back later.</div>
            </div>
        );
    }

    // Registration already closed
    if (availability && isAfterRegistrationClosed(availability)) {
        return (
            <div className="card h-100 shadow-sm">
                <div className="card-header text-center"><h3>Registration is closed</h3></div>
                <div className="card-body text-center">Registration for this event has closed. See you next time!</div>
            </div>
        );
    }

    // Registration form
    return (
        <div className="mx-auto">
            {availability?.eventName && <h2 className="text-light text-center mb-4">{availability.eventName}</h2>}
            <form ref={formRef} onSubmit={handleSubmit} className="ticket-form">

                <TicketSelectionForm
                    availability={availability}
                    selectedTicketTypeIds={selectedTicketTypeIds}
                    setSelectedTicketTypeIds={setSelectedTicketTypeIds}
                    disabled={submitting}
                />

                <AttendeeDetailsForm
                    details={details}
                    setDetails={setDetails}
                    additionalFields={additionalFields}
                    disabled={submitting}
                >
                    <div className="text-center text-light mt-3">
                        {submittingError && <div className="text-danger mt-2">{submittingError}</div>}

                        <div className="text-center">
                            <SpinningButton loading={submitting} disabled={!isFormValid()} className="mt-2">
                                Register
                            </SpinningButton>
                        </div>

                    </div>
                </AttendeeDetailsForm>

            </form>
        </div>
    );
}
