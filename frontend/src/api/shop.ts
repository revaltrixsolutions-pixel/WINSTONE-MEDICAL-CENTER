import api from "./axios";

export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  imageUrls: string[];
  stock: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderInput {
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod:
    | "PAY_NOW"
    | "PAY_LATTER"
    | "PAY_LATER";
  paymentId?: string;
  deliveryType:
    | "WHATSAPP_1HR"
    | "STANDARD_5HR";
}

export interface ConfirmPaymentInput {
  note?: string;
}

export const shopApi = {
  getProducts: async () => {
    const response =
      await api.get<Product[]>(
        "/api/shop/products"
      );

    return response.data;
  },

  createOrder: async (
    data: OrderInput
  ) => {
    const response =
      await api.post(
        "/api/shop/orders",
        data
      );

    return response.data;
  },

  getAdminProducts: async () => {
    const response =
      await api.get<Product[]>(
        "/api/shop/admin/products"
      );

    return response.data;
  },

  createProduct: async (
    data: Partial<Product>
  ) => {
    const response =
      await api.post(
        "/api/shop/admin/products",
        data
      );

    return response.data;
  },

  updateProduct: async (
    id: string,
    data: Partial<Product>
  ) => {
    const response =
      await api.put(
        `/api/shop/admin/products/${id}`,
        data
      );

    return response.data;
  },

  deleteProduct: async (
    id: string
  ) => {
    const response =
      await api.delete(
        `/api/shop/admin/products/${id}`
      );

    return response.data;
  },

  getAdminOrders: async () => {
    const response =
      await api.get(
        "/api/shop/admin/orders"
      );

    return response.data;
  },

  confirmPayment: async (
    id: string,
    data: ConfirmPaymentInput
  ) => {
    const response =
      await api.post(
        `/api/shop/admin/orders/${id}/confirm-payment`,
        data
      );

    return response.data;
  },

  updateOrderNote: async (
    id: string,
    note: string
  ) => {
    const response =
      await api.put(
        `/api/shop/admin/orders/${id}/note`,
        { note }
      );

    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    status: string
  ) => {
    const response =
      await api.put(
        `/api/shop/admin/orders/${id}/status`,
        { status }
      );

    return response.data;
  },

  uploadProductImage: async (
    file: File
  ) => {
    const formData = new FormData();

    formData.append(
      "image",
      file
    );

    const response =
      await api.post(
        "/api/shop/admin/products/upload-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data as {
      success: boolean;
      imageUrl: string;
    };
  },
};