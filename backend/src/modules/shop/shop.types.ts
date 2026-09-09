export interface CreateProductInput {
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  imageUrls?: string[];
  stock?: number;
  active?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface CreateOrderInput {
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: 'PAY_NOW' | 'PAY_LATTER';
  paymentId?: string;
  deliveryType: 'WHATSAPP_1HR' | 'STANDARD_5HR';
}
