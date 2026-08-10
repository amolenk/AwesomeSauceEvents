import type { AdditionalFieldDto } from "@/src/api/admitto";

export interface AdditionalField {
    key: string;
    label: string;
    maxLength: number;
    required: boolean;
}

export function parseAdditionalField(field: AdditionalFieldDto): AdditionalField {
    const name = field.name.trim();
    const required = name.endsWith("*");
    const label = required ? name.slice(0, -1).trimEnd() : name;

    return { key: field.key, label, maxLength: field.maxLength, required };
}
