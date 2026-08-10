'use client'

import React from "react";
import { AdditionalField } from "@/src/utils/additional-fields";
import AdditionalDetailsForm from "./AdditionalDetailsForm";

export interface AttendeeDetails {
    firstName: string;
    lastName: string;
    additionalDetails: Record<string, string>;
}

interface AttendeeDetailsFormProps {
    details: AttendeeDetails;
    setDetails: React.Dispatch<React.SetStateAction<AttendeeDetails>>;
    additionalFields: AdditionalField[];
    disabled: boolean;
    children?: React.ReactNode;
}

export default function AttendeeDetailsForm({ details, setDetails, additionalFields, disabled, children }: AttendeeDetailsFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const setAdditionalDetails: React.Dispatch<React.SetStateAction<Record<string, string>>> = (update) => {
        setDetails(prev => ({
            ...prev,
            additionalDetails: typeof update === "function" ? update(prev.additionalDetails) : update
        }));
    };

    return (
        <div className="card h-100 shadow-sm mt-3">
            <div className="card-header text-center"><h3>Tell us a bit about yourself</h3></div>
            <div className="card-body text-center mx-md-5">

                <div className="form-group mb-3 text-start">
                    <label htmlFor="firstName" className="form-label">First name<span className="text-danger">*</span></label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={details.firstName}
                        onChange={handleChange}
                        maxLength={50}
                        required
                        className="form-control"
                        disabled={disabled}
                    />
                </div>
                <div className="form-group mb-3 text-start">
                    <label htmlFor="lastName" className="form-label">Last name<span className="text-danger">*</span></label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={details.lastName}
                        onChange={handleChange}
                        maxLength={50}
                        required
                        className="form-control"
                        disabled={disabled}
                    />
                </div>

                <AdditionalDetailsForm
                    fields={additionalFields}
                    values={details.additionalDetails}
                    setValues={setAdditionalDetails}
                    disabled={disabled}
                />

                {children}
            </div>
        </div>
    );
}
