'use client'

import React from "react";
import { AdditionalField } from "@/src/utils/additional-fields";

interface AdditionalDetailsFormProps {
    fields: AdditionalField[];
    values: Record<string, string>;
    setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    disabled: boolean;
}

export default function AdditionalDetailsForm({ fields, values, setValues, disabled }: AdditionalDetailsFormProps) {
    if (fields.length === 0) {
        return null;
    }

    const handleChange = (key: string, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            {fields.map(field => (
                <div key={field.key} className="form-group mb-3 text-start">
                    <label htmlFor={`field-${field.key}`} className="form-label">
                        {field.label}
                        {field.required && <span className="text-danger">*</span>}
                    </label>
                    <input
                        type="text"
                        id={`field-${field.key}`}
                        name={field.key}
                        value={values[field.key] ?? ""}
                        onChange={e => handleChange(field.key, e.target.value)}
                        maxLength={field.maxLength}
                        required={field.required}
                        className="form-control"
                        disabled={disabled}
                    />
                </div>
            ))}
        </>
    );
}
