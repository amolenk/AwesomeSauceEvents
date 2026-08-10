'use client'

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAvailability, Availability, getRegistration, isAfterRegistrationClosed, updateRegistration, resendTicketEmail } from "../../api/admitto";
import { AdditionalField, parseAdditionalField } from "@/src/utils/additional-fields";
import SpinningButton from "../common/SpinningButton";
import TicketSelectionForm from "./TicketSelectionForm";
import AttendeeDetailsForm, { AttendeeDetails } from "./AttendeeDetailsForm";
import Link from "next/link";
import ErrorCard from "../common/ErrorCard";
import { eventRoute } from "@/src/utils/event-routes";

interface UpdateRegistrationFormProps {
    event: string;
    registrationId: string;
}

const emptyDetails: AttendeeDetails = {
    firstName: "",
    lastName: "",
    additionalDetails: {}
};

export default function UpdateRegistrationForm({ event, registrationId }: UpdateRegistrationFormProps) {

    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState("");
    const [cancelled, setCancelled] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submittingError, setSubmittingError] = useState("");
    const [resendingTicketEmail, setResendingTicketEmail] = useState(false);
    const [resendTicketEmailMessage, setResendTicketEmailMessage] = useState("");
    const [resendTicketEmailError, setResendTicketEmailError] = useState("");
    const [availability, setAvailability] = useState<Availability | null>(null);
    const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>([]);
    const [selectedTicketTypeIds, setSelectedTicketTypeIds] = useState<string[]>([]);
    const [originalTicketTypeIds, setOriginalTicketTypeIds] = useState<string[]>([]);
    const [details, setDetails] = useState<AttendeeDetails>(emptyDetails);
    const [originalDetails, setOriginalDetails] = useState<AttendeeDetails>(emptyDetails);

    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const [availabilityResult, registrationResult] = await Promise.all([
                    getAvailability(event),
                    getRegistration(event, registrationId)
                ]);

                // Ensure the attendee's existing tickets stay selectable even if
                // that ticket type is now sold out.
                if (registrationResult.tickets.length > 0 && availabilityResult.ticketTypes) {
                    registrationResult.tickets.forEach(existingTicketTypeId => {
                        const ticketType = availabilityResult.ticketTypes.find(t => t.id === existingTicketTypeId);
                        if (ticketType && ticketType.hasCapacity === false) {
                            ticketType.hasCapacity = true;
                        }
                    });
                }

                setAvailability(availabilityResult);
                setAdditionalFields(availabilityResult.additionalFields.map(parseAdditionalField));

                if (registrationResult.status === "cancelled") {
                    setCancelled(true);
                } else {
                    setSelectedTicketTypeIds(registrationResult.tickets);
                    setOriginalTicketTypeIds(registrationResult.tickets);

                    const attendeeDetails: AttendeeDetails = {
                        firstName: registrationResult.firstName,
                        lastName: registrationResult.lastName,
                        additionalDetails: registrationResult.additionalDetails || {}
                    };
                    setDetails(attendeeDetails);
                    setOriginalDetails(attendeeDetails);
                }

                setLoading(false);
            } catch (err: unknown) {
                setLoadingError(err instanceof Error ? err.message : "Could not fetch ticket availability.");
                setLoading(false);
            }
        }
        fetchData();
    }, [event, registrationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmittingError("");

        try {
            // Admitto only sends a new ticket email when the ticket selection actually changes.
            const ticketsChanged = !arraysEqual(originalTicketTypeIds, selectedTicketTypeIds);

            await updateRegistration(
                event,
                registrationId,
                details.firstName,
                details.lastName,
                selectedTicketTypeIds,
                details.additionalDetails);

            router.push(`${eventRoute(event, "/register/updated")}?ticketsChanged=${ticketsChanged}`);
        } catch (err: unknown) {
            setSubmitting(false);
            setSubmittingError(err instanceof Error ? err.message : "Registration update failed. Please try again.");
        }
    };

    const handleResendTicketEmail = async () => {
        setResendingTicketEmail(true);
        setResendTicketEmailMessage("");
        setResendTicketEmailError("");

        try {
            await resendTicketEmail(event, registrationId);
            setResendTicketEmailMessage("Your ticket email has been resent. Please check your inbox.");
        } catch (err: unknown) {
            setResendTicketEmailError(err instanceof Error ? err.message : "Could not resend your ticket email. Please try again.");
        } finally {
            setResendingTicketEmail(false);
        }
    };

    // Helper to compare arrays (order-insensitive)
    function arraysEqual(a: string[], b: string[]) {
        if (a.length !== b.length) return false;
        const aSorted = [...a].sort();
        const bSorted = [...b].sort();
        return aSorted.every((val, idx) => val === bSorted[idx]);
    }

    const isFormValid = () =>
        (formRef.current?.checkValidity() ?? false)
        && selectedTicketTypeIds.length > 0
        && (!arraysEqual(originalTicketTypeIds, selectedTicketTypeIds)
            || JSON.stringify(details) !== JSON.stringify(originalDetails));

    // Loading spinner
    if (loading) {
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

    // Registration was already cancelled
    if (cancelled) {
        return (
            <div className="card h-100 shadow-sm">
                <div className="card-header text-center"><h3>Registration Cancelled</h3></div>
                <div className="card-body text-center">This registration has already been cancelled and can no longer be updated.</div>
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

    // Update form
    return (
        <div className="mx-auto">
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
                        {resendTicketEmailMessage && <div className="mt-2">{resendTicketEmailMessage}</div>}
                        {resendTicketEmailError && <div className="text-danger mt-2">{resendTicketEmailError}</div>}

                        <div className="text-center">
                            <SpinningButton loading={submitting} disabled={!isFormValid()} className="mt-2 me-3">
                                Update Registration
                            </SpinningButton>
                            <SpinningButton loading={resendingTicketEmail} type="button" disabled={submitting} className="mt-2 me-3" onClick={handleResendTicketEmail}>
                                Resend Ticket Email
                            </SpinningButton>
                            <Link href={eventRoute(event, `/cancel/${registrationId}`)} className="btn btn-danger mt-2">
                                Cancel Registration
                            </Link>
                        </div>

                    </div>
                </AttendeeDetailsForm>

            </form>
        </div>
    );
}
