import { PrismaClient } from "../../../generated/prisma/index.js";

import type {
  CreateProductInput,
  UpdateProductInput,
  CreateOrderInput,
  ConfirmPaymentInput,
} from "./shop.types.js";

const prisma = new PrismaClient();

export class ShopService {
  /* =========================================================
     PUBLIC PRODUCTS
  ========================================================= */

  async getAllProducts() {
    return await prisma.product.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================================================
     ADMIN PRODUCTS
  ========================================================= */

  async getAllProductsAdmin() {
    return await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================================================
     CREATE PRODUCT
  ========================================================= */

  async createProduct(data: CreateProductInput) {
    return await prisma.product.create({
      data: {
        name: data.name,
        shortDescription:
          data.shortDescription || null,
        description: data.description,
        price: Number(data.price),
        imageUrls: data.imageUrls || [],
        stock: Number(data.stock || 0),
        active:
          data.active === undefined
            ? true
            : Boolean(data.active),
      },
    });
  }

  /* =========================================================
     UPDATE PRODUCT
  ========================================================= */

  async updateProduct(
    id: string,
    data: UpdateProductInput
  ) {
    return await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.shortDescription !== undefined && {
          shortDescription:
            data.shortDescription || null,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.price !== undefined && {
          price: Number(data.price),
        }),

        ...(data.imageUrls !== undefined && {
          imageUrls: data.imageUrls,
        }),

        ...(data.stock !== undefined && {
          stock: Number(data.stock),
        }),

        ...(data.active !== undefined && {
          active: Boolean(data.active),
        }),
      },
    });
  }

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: {
        id,
      },
    });
  }

  /* =========================================================
     CREATE ORDER
  ========================================================= */

  async createOrder(data: CreateOrderInput) {
    const product =
      await prisma.product.findUnique({
        where: {
          id: data.productId,
        },
      });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (!product.active) {
      throw new Error(
        "This product is currently unavailable."
      );
    }

    if (product.stock <= 0) {
      throw new Error(
        "This product is currently out of stock."
      );
    }

    return await prisma.order.create({
      data: {
        productId: data.productId,

        customerName:
          data.customerName.trim(),

        customerPhone:
          data.customerPhone.trim(),

        customerEmail:
          data.customerEmail?.trim() || null,

        paymentMethod:
          data.paymentMethod,

        paymentId:
          data.paymentId?.trim() || null,

        deliveryType:
          data.deliveryType,

        status: "PENDING",
      },

      include: {
        product: true,
      },
    });
  }

  /* =========================================================
     ADMIN ORDERS
  ========================================================= */

  async getAdminOrders() {
    return await prisma.order.findMany({
      include: {
        product: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================================================
     CONFIRM PAYMENT
  ========================================================= */

  async confirmPayment(
    id: string,
    data: ConfirmPaymentInput
  ) {
    const order =
      await prisma.order.findUnique({
        where: {
          id,
        },
        include: {
          product: true,
        },
      });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status === "CONFIRMED") {
      return order;
    }

    const updatedOrder =
      await prisma.order.update({
        where: {
          id,
        },

        data: {
          status: "CONFIRMED",

          adminNote:
            data.note?.trim() || null,

          confirmedAt:
            new Date(),
        },

        include: {
          product: true,
        },
      });

    return updatedOrder;
  }

  /* =========================================================
     UPDATE ORDER NOTE
  ========================================================= */

  async updateOrderNote(
    id: string,
    note: string
  ) {
    return await prisma.order.update({
      where: {
        id,
      },

      data: {
        adminNote:
          note.trim() || null,
      },

      include: {
        product: true,
      },
    });
  }

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  async updateOrderStatus(
    id: string,
    status: string
  ) {
    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(
        "Invalid order status."
      );
    }

    return await prisma.order.update({
      where: {
        id,
      },

      data: {
        status,
      },

      include: {
        product: true,
      },
    });
  }
}