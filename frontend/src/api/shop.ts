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
}

export interface OrderInput {
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: "PAY_NOW" | "PAY_LATTER";
  paymentId?: string;
  deliveryType: "WHATSAPP_1HR" | "STANDARD_5HR";
}

export const shopApi = {
  getProducts: async () => {
    const response = await api.get<Product[]>("/api/shop/products");
    return response.data;
  },
  createOrder: async (data: OrderInput) => {
    const response = await api.post("/api/shop/orders", data);
    return response.data;
  },
  getAdminProducts: async () => {
    const response = await api.get<Product[]>("/api/shop/admin/products");
    return response.data;
  },
  createProduct: async (data: Partial<Product>) => {
    const response = await api.post("/api/shop/admin/products", data);
    return response.data;
  },
  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await api.put(`/api/shop/admin/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/shop/admin/products/${id}`);
    return response.data;
  },
  getAdminOrders: async () => {
    const response = await api.get("/api/shop/admin/orders");
    return response.data;
  },
};