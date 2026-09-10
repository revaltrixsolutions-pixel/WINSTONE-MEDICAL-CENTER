export interface CreateProductInput {
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  imageUrls?: string[];
  stock?: number;
  active?: boolean;
}

export interface UpdateProductInput
  extends Partial<CreateProductInput> {}

export interface OrderLocationInput {
  county: string;
  town: string;
  place: string;
  road: string;
  building?: string;
  lat?: number;
  lng?: number;
}

export interface CreateOrderInput {
  productId: string;

  quantity?: number;
  customerNote?: string;

  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  location: OrderLocationInput;

  paymentMethod: "PAY_NOW" | "PAY_LATTER";

  paymentId?: string;

  deliveryType:
    | "WHATSAPP_1HR"
    | "STANDARD_5HR";
}

export interface ConfirmPaymentInput {
  note?: string;
}