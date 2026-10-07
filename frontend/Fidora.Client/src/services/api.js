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