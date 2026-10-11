const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getSpaces() {
    const response = await fetch(`${API_BASE_URL}/api/spaces`);

    if (!response.ok) {
        throw new Error("Failed to load spaces.");
    }

    return response.json();
}

export function getApiAssetUrl(path) {
    return `${API_BASE_URL}${path}`;
}

export async function getSessions(spaceId, date) {
    const params = new URLSearchParams();

    if (spaceId) {
        params.append("spaceId", spaceId);
    }

    if (date) {
        params.append("date", date);
    }

    const response = await fetch(`${API_BASE_URL}/api/sessions?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to load sessions.");
    }

    return response.json();
}

export async function createBooking(booking) {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {"Content-Type":"application/json",},
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        throw new Error("Failed to create booking.");
    }

    return response.json();
}