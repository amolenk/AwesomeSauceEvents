import "server-only";

export interface AdmittoSettings {
    baseUrl: string;
}

export function getAdmittoSettings(): AdmittoSettings {
    return {
        baseUrl: process.env.ADMITTO_URL || "https://api.admitto.org"
    };
}

// The API key is scoped to the team, so no separate team ID configuration is
// needed on the server.
export function getAdmittoApiKey(): string {
    const apiKey = process.env.ADMITTO_API_KEY;
    if (!apiKey) {
        throw new Error("ADMITTO_API_KEY is not configured.");
    }

    return apiKey;
}
