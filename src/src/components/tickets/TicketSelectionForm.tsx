'use client'

import { Availability, TicketTypeDto } from "@/src/api/admitto";

interface TicketSelectionFormProps {
    availability: Availability | null;
    selectedTicketTypeIds: string[];
    setSelectedTicketTypeIds: React.Dispatch<React.SetStateAction<string[]>>;
    disabled: boolean;
}

export default function TicketSelectionForm({
    availability, selectedTicketTypeIds, setSelectedTicketTypeIds, disabled
}: TicketSelectionFormProps) {

    const ticketTypes = availability?.ticketTypes ?? [];

    const toggle = (id: string) => {
        setSelectedTicketTypeIds(current =>
            current.includes(id)
                ? current.filter(t => t !== id)
                : [...current, id]
        );
    };

    return (
        <div className="card h-100 shadow-sm mb-4 mt-3">
            <div className="card-header text-center"><h3>Choose your tickets</h3></div>
            <div className="card-body mx-md-5">
                <p>Select the ticket(s) you would like to register for<span className="text-danger">*</span>.</p>

                {!availability ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : ticketTypes.length === 0 ? (
                    <div className="alert alert-info text-start" role="status">
                        There are no tickets available for this event right now.
                    </div>
                ) : (
                    ticketTypes.map((ticket: TicketTypeDto) => {
                        const selected = selectedTicketTypeIds.includes(ticket.id);
                        const selectable = ticket.hasCapacity || selected;
                        return (
                            <div key={ticket.id} className="form-check text-start mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={ticket.id}
                                    checked={selected}
                                    disabled={!selectable || disabled}
                                    onChange={() => toggle(ticket.id)}
                                />
                                <label className="form-check-label ms-2" htmlFor={ticket.id}>
                                    {ticket.name}
                                    {!ticket.hasCapacity && <span className="badge bg-danger ms-2">Sold Out</span>}
                                </label>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
