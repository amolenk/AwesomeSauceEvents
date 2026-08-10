// Browser-facing ticket API calls. These call local Next.js routes; the routes
// call Admitto server-side and add the private, team-scoped API credentials.
//
// Every call scopes the local API route under the event slug.

import { ticketApiRoute } from "@/src/utils/event-routes";

export class AdmittoError extends Error {
    code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
    }
}

export interface TicketTypeDto {
    id: string;
    name: string;
    timeSlots: string[];
    status: "available" | "waitlist" | "soldOut";
    hasCapacity: boolean;
}

export interface AdditionalFieldDto {
    key: string;
    name: string;
    maxLength: number;
}

export interface Availability {
    eventName: string;
    registrationOpensAt?: string;
    registrationClosesAt?: string;
    ticketTypes: TicketTypeDto[];
    additionalFields: AdditionalFieldDto[];
}

export interface RegistrationDetail {
    id: string;
    status: "registered" | "cancelled";
    firstName: string;
    lastName: string;
    additionalDetails: Record<string, string>;
    tickets: string[];
}

export interface VerificationResult {
    registrationToken: string;
    registrationId?: string;
    email: string;
}

export function isRegistrationOpen(availability: Availability): boolean {
    return !isBeforeRegistrationOpen(availability) && !isAfterRegistrationClosed(availability);
}

export function isBeforeRegistrationOpen(availability: Availability): boolean {
    const now = new Date().getTime();
    const opensAt = availability?.registrationOpensAt && new Date(availability.registrationOpensAt).getTime();

    return !!opensAt && now < opensAt;
}

export function isAfterRegistrationClosed(availability: Availability): boolean {
    const now = new Date().getTime();
    const closesAt = availability?.registrationClosesAt && new Date(availability.registrationClosesAt).getTime();

    return !!closesAt && now > closesAt;
}

export async function requestOtp(event: string, email: string) {
    await request<void>(ticketApiRoute(event, "/otp/request"), {
        method: "POST",
        body: JSON.stringify({ email })
    });
}

export async function cancel(event: string, registrationId: string) {
    await request<void>(ticketApiRoute(event, `/registration/${encodeURIComponent(registrationId)}/cancel`), {
        method: "POST"
    });
}

export async function resendTicketEmail(event: string, registrationId: string) {
    await request<void>(ticketApiRoute(event, `/registration/${encodeURIComponent(registrationId)}/ticket-email/resend`), {
        method: "POST"
    });
}

export async function verifyOtp(event: string, email: string, code: string) {
    return await request<VerificationResult>(ticketApiRoute(event, "/otp/verify"), {
        method: "POST",
        body: JSON.stringify({ email, code })
    });
}

export async function getAvailability(event: string): Promise<Availability> {
    return await request<Availability>(ticketApiRoute(event, "/availability"));
}

export async function getRegistration(event: string, registrationId: string): Promise<RegistrationDetail> {
    return await request<RegistrationDetail>(ticketApiRoute(event, `/registration/${encodeURIComponent(registrationId)}`));
}

export async function register(
    event: string,
    email: string,
    firstName: string,
    lastName: string,
    ticketTypeIds: string[],
    additionalDetails: Record<string, string>,
    registrationToken: string) {

    await request<void>(ticketApiRoute(event, "/register"), {
        method: "POST",
        body: JSON.stringify({
            email,
            firstName,
            lastName,
            ticketTypeIds,
            registrationToken,
            additionalDetails
        })
    });

    return true;
}

export async function updateRegistration(
    event: string,
    registrationId: string,
    firstName: string,
    lastName: string,
    ticketTypeIds: string[],
    additionalDetails: Record<string, string>) {

    await request<void>(ticketApiRoute(event, `/registration/${encodeURIComponent(registrationId)}`), {
        method: "PUT",
        body: JSON.stringify({
            firstName,
            lastName,
            ticketTypeIds,
            additionalDetails
        })
    });

    return true;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers
        }
    });

    if (!res.ok) {
        throw await createError(res);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return await res.json() as T;
}

async function createError(res: Response): Promise<AdmittoError> {
    let errorData: unknown = null;
    try {
        errorData = await res.json();
    } catch {
        // Use the generic message below when the response body is not JSON.
    }

    const problem = typeof errorData === "object" && errorData !== null
        ? errorData as Record<string, unknown>
        : null;

    return new AdmittoError(
        stringValue(problem?.detail) || stringValue(problem?.title) || `The ticketing request failed (HTTP ${res.status}).`,
        stringValue(problem?.code) || stringValue(problem?.errorCode)
    );
}

function stringValue(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}
