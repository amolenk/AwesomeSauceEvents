export function eventRoute(eventSlug: string, path = ""): string {
    return `/${encodeURIComponent(eventSlug)}${path}`;
}

export function ticketApiRoute(eventSlug: string, path: string): string {
    return eventRoute(eventSlug, `/api/tickets${path}`);
}
