export type GalleryMediaType = "image" | "video" | "embed";

export interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: GalleryMediaType;
  url: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGalleryItemPayload {
  title: string;
  description?: string | null;
  type: GalleryMediaType;
  url: string;
  isActive?: boolean;
}

export interface UpdateGalleryItemPayload {
  title?: string;
  description?: string | null;
  type?: GalleryMediaType;
  url?: string;
  isActive?: boolean;
}

interface GalleryResponse {
  success?: boolean;
  message?: string;
  error?: string;
  item?: GalleryItem;
  data?: GalleryItem | GalleryItem[];
  items?: GalleryItem[];
}

const API_BASE_URL = "/api/gallery";

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
          ? data.error
          : `Gallery request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data as T;
}

function getItemsFromResponse(
  response: GalleryResponse | GalleryItem[],
): GalleryItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

function getItemFromResponse(
  response: GalleryResponse | GalleryItem,
): GalleryItem {
  if ("id" in response) {
    return response;
  }

  if (response.item) {
    return response.item;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    typeof response.data === "object"
  ) {
    return response.data;
  }

  throw new Error("Server did not return a gallery item.");
}

export async function getGalleryItems(
  activeOnly = false,
): Promise<GalleryItem[]> {
  const query = activeOnly ? "?active=true" : "";

  const response = await fetch(`${API_BASE_URL}${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await parseResponse<GalleryResponse | GalleryItem[]>(
    response,
  );

  return getItemsFromResponse(data);
}

export async function getGalleryItem(
  id: string,
): Promise<GalleryItem> {
  if (!id) {
    throw new Error("Gallery item ID is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await parseResponse<GalleryResponse | GalleryItem>(
    response,
  );

  return getItemFromResponse(data);
}

export async function createGalleryItem(
  payload: CreateGalleryItemPayload,
): Promise<GalleryItem> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: payload.title.trim(),
      description:
        payload.description?.trim() || null,
      type: payload.type,
      url: payload.url.trim(),
      isActive: payload.isActive ?? true,
    }),
  });

  const data = await parseResponse<GalleryResponse | GalleryItem>(
    response,
  );

  return getItemFromResponse(data);
}

export async function updateGalleryItem(
  id: string,
  payload: UpdateGalleryItemPayload,
): Promise<GalleryItem> {
  if (!id) {
    throw new Error("Gallery item ID is required.");
  }

  const body: UpdateGalleryItemPayload = {
    ...payload,
  };

  if (typeof body.title === "string") {
    body.title = body.title.trim();
  }

  if (typeof body.description === "string") {
    body.description = body.description.trim() || null;
  }

  if (typeof body.url === "string") {
    body.url = body.url.trim();
  }

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data = await parseResponse<GalleryResponse | GalleryItem>(
    response,
  );

  return getItemFromResponse(data);
}

export async function toggleGalleryItem(
  id: string,
  isActive: boolean,
): Promise<GalleryItem> {
  return updateGalleryItem(id, {
    isActive,
  });
}

export async function deleteGalleryItem(
  id: string,
): Promise<void> {
  if (!id) {
    throw new Error("Gallery item ID is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    },
  );

  await parseResponse<GalleryResponse>(response);
}

export async function uploadGalleryFile(
  file: File,
  options?: {
    title?: string;
    description?: string;
    type?: GalleryMediaType;
    isActive?: boolean;
  },
): Promise<GalleryItem> {
  if (!file) {
    throw new Error("A file is required.");
  }

  const formData = new FormData();

  formData.append("file", file);

  if (options?.title) {
    formData.append("title", options.title);
  }

  if (options?.description) {
    formData.append("description", options.description);
  }

  if (options?.type) {
    formData.append("type", options.type);
  }

  formData.append(
    "isActive",
    String(options?.isActive ?? true),
  );

  const response = await fetch(
    `${API_BASE_URL}/upload`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    },
  );

  const data = await parseResponse<GalleryResponse | GalleryItem>(
    response,
  );

  return getItemFromResponse(data);
}

export const galleryApi = {
  getAll: getGalleryItems,
  getOne: getGalleryItem,
  create: createGalleryItem,
  update: updateGalleryItem,
  toggleActive: toggleGalleryItem,
  delete: deleteGalleryItem,
  upload: uploadGalleryFile,
};

export default galleryApi;