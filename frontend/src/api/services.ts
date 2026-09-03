// frontend/src/api/services.ts

export interface MedicalService {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  icon: string;
  imageUrl?: string;
  imageUrls?: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMedicalServicePayload {
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
}

export interface UpdateMedicalServicePayload {
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

const SERVICES_ENDPOINT = `${API_BASE_URL}/api/services`;

function normalizeImageUrls(service: MedicalService): string[] {
  if (Array.isArray(service.imageUrls)) {
    return service.imageUrls.filter(
      (image): image is string => typeof image === "string" && image.trim() !== "",
    );
  }

  if (typeof service.imageUrl === "string" && service.imageUrl.trim()) {
    return [service.imageUrl];
  }

  return [];
}

function normalizeService(service: MedicalService): MedicalService {
  const imageUrls = normalizeImageUrls(service);

  return {
    ...service,
    imageUrls,
    imageUrl: imageUrls[0] || "",
    active: Boolean(service.active),
  };
}

function normalizeServices(services: MedicalService[]): MedicalService[] {
  return services.map(normalizeService);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text();

  let responseData: unknown = null;

  if (responseText.trim()) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      if (!response.ok) {
        throw new Error(
          `Request failed with ${response.status} ${response.statusText}. Server response: ${responseText.slice(0, 300)}`,
        );
      }

      throw new Error(
        `The server returned invalid JSON. Response: ${responseText.slice(0, 300)}`,
      );
    }
  }

  if (!response.ok) {
    const apiError = responseData as ApiErrorResponse | null;

    const message =
      apiError?.message ||
      apiError?.error ||
      `Request failed with ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return responseData as T;
}

function buildPayload(
  payload: CreateMedicalServicePayload | UpdateMedicalServicePayload,
): CreateMedicalServicePayload {
  return {
    name: payload.name.trim(),
    shortDescription: payload.shortDescription.trim(),
    description: payload.description.trim(),
    icon: payload.icon.trim() || "Stethoscope",
    imageUrls: Array.isArray(payload.imageUrls)
      ? payload.imageUrls
          .filter(
            (image): image is string =>
              typeof image === "string" && image.trim() !== "",
          )
          .map((image) => image.trim())
          .slice(0, 5)
      : [],
  };
}

export async function getServices(
  activeOnly = false,
): Promise<MedicalService[]> {
  const searchParams = new URLSearchParams();

  if (activeOnly) {
    searchParams.set("active", "true");
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `${SERVICES_ENDPOINT}?${queryString}`
    : SERVICES_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const services = await parseResponse<MedicalService[]>(response);

  return normalizeServices(services);
}

export async function getActiveServices(): Promise<MedicalService[]> {
  return getServices(true);
}

export async function getServiceById(
  id: string,
): Promise<MedicalService> {
  if (!id.trim()) {
    throw new Error("A service ID is required.");
  }

  const response = await fetch(
    `${SERVICES_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const service = await parseResponse<MedicalService>(response);

  return normalizeService(service);
}

export async function createService(
  payload: CreateMedicalServicePayload,
): Promise<MedicalService> {
  const cleanPayload = buildPayload(payload);

  const response = await fetch(SERVICES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(cleanPayload),
  });

  const service = await parseResponse<MedicalService>(response);

  return normalizeService(service);
}

export async function updateService(
  id: string,
  payload: UpdateMedicalServicePayload,
): Promise<MedicalService> {
  if (!id.trim()) {
    throw new Error("A service ID is required.");
  }

  const cleanPayload = buildPayload(payload);

  const response = await fetch(
    `${SERVICES_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(cleanPayload),
    },
  );

  const service = await parseResponse<MedicalService>(response);

  return normalizeService(service);
}

export async function setServiceVisibility(
  id: string,
  active: boolean,
): Promise<MedicalService> {
  if (!id.trim()) {
    throw new Error("A service ID is required.");
  }

  const response = await fetch(
    `${SERVICES_ENDPOINT}/${encodeURIComponent(id)}/visibility`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ active }),
    },
  );

  const service = await parseResponse<MedicalService>(response);

  return normalizeService(service);
}

export async function toggleServiceVisibility(
  service: MedicalService,
): Promise<MedicalService> {
  return setServiceVisibility(service.id, !service.active);
}

export async function deleteService(id: string): Promise<void> {
  if (!id.trim()) {
    throw new Error("A service ID is required.");
  }

  const response = await fetch(
    `${SERVICES_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    },
  );

  await parseResponse<{ message?: string }>(response);
}




