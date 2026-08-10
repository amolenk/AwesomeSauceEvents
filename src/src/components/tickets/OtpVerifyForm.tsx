'use client'

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "./OtpInput";
import SpinningButton from "../common/SpinningButton";
import { verifyOtp as admittoVerifyOtp } from "../../api/admitto";
import { eventRoute } from "@/src/utils/event-routes";

interface OtpVerifyFormProps {
    event: string;
}

export default function OtpVerifyForm({ event }: OtpVerifyFormProps) {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email") || "";
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const code = otp.join("");
        try {
            const verificationResult = await admittoVerifyOtp(event, email, code);
            // If Admitto found an existing registration, let the attendee update it.
            if (verificationResult.registrationId) {
                router.push(`${eventRoute(event, `/edit/${verificationResult.registrationId}`)}?redirect=true`);
            } else {
                router.push(`${eventRoute(event, "/register")}?token=${encodeURIComponent(verificationResult.registrationToken)}&email=${encodeURIComponent(email)}`);
            }
        } catch (err: unknown) {
            setLoading(false);
            setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
        }
    };
 
    return (
        <form onSubmit={handleSubmit} className="ticket-form">
            {error && <div className="text-danger my-3">{error}</div>}
            <OtpInput value={otp} onChange={setOtp} />
            <SpinningButton loading={loading} disabled={otp.some(digit => digit === "")} className="mt-2">
                Verify email
            </SpinningButton>
        </form>
    );
}
