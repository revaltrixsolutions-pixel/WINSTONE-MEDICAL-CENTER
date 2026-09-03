export interface MedicalService {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  icon: string;
  imageUrl?: string;
  imageUrls?: string[];
  active: boolean;
}

export type MedicalServicePayload = {
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
};

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/services`;

async function parseApiResponse<T>(response: Response): Promise<T> {
  const rawResponse = await response.text();

  let data: unknown = null;

  if (rawResponse.trim()) {
    try {
      data = JSON.parse(rawResponse);
    } catch {
      throw new Error(
        `Invalid server response (${response.status}): ${rawResponse.slice(0, 250)}`,
      );
    }
  }

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed: ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return data as T;
}

function normalizeService(service: MedicalService): MedicalService {
  const imageUrls = Array.isArray(service.imageUrls)
    ? service.imageUrls
    : service.imageUrl
      ? [service.imageUrl]
      : [];

  return {
    ...service,
    imageUrls,
    imageUrl: imageUrls[0] || "",
    active: Boolean(service.active),
  };
}

export async function getServices(
  activeOnly = false,
): Promise<MedicalService[]> {
  const query = activeOnly ? "?active=true" : "";

  const response = await fetch(`${API_URL}${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const services = await parseApiResponse<MedicalService[]>(response);

  return services.map(normalizeService);
}

export async function getServiceById(
  id: string,
): Promise<MedicalService> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const service = await parseApiResponse<MedicalService>(response);

  return normalizeService(service);
}

export async function createService(
  service: MedicalServicePayload,
): Promise<MedicalService> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: service.name.trim(),
      shortDescription: service.shortDescription.trim(),
      description: service.description.trim(),
      icon: service.icon,
      imageUrls: service.imageUrls.slice(0, 5),
    }),
  });

  const createdService = await parseApiResponse<MedicalService>(response);

  return normalizeService(createdService);
}

export async function updateService(
  id: string,
  service: MedicalServicePayload,
): Promise<MedicalService> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: service.name.trim(),
      shortDescription: service.shortDescription.trim(),
      description: service.description.trim(),
      icon: service.icon,
      imageUrls: service.imageUrls.slice(0, 5),
    }),
  });

  const updatedService = await parseApiResponse<MedicalService>(response);

  return normalizeService(updatedService);
}

export async function setServiceVisibility(
  id: string,
  active: boolean,
): Promise<MedicalService> {
  const response = await fetch(`${API_URL}/${id}/visibility`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ active }),
  });

  const updatedService = await parseApiResponse<MedicalService>(response);

  return normalizeService(updatedService);
}

export async function deleteService(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  await parseApiResponse<{ message: string }>(response);
}










