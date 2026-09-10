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
     RESPONSE SHAPING
     The DB stores delivery location as flat columns
     (locationCounty, locationTown, ...). The frontend expects
     a nested `location: { county, town, ... }` object, so every
     order returned to a client goes through this formatter.
  ========================================================= */

  private formatOrder(order: any) {
    if (!order) return order;

    const {
      locationCounty,
      locationTown,
      locationPlace,
      locationRoad,
      locationBuilding,
      locationLat,
      locationLng,
      ...rest
    } = order;

    return {
      ...rest,
      location: {
        county: locationCounty,
        town: locationTown,
        place: locationPlace,
        road: locationRoad,
        building: locationBuilding,
        lat: locationLat,
        lng: locationLng,
      },
    };
  }

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

    const quantity =
      Number.isInteger(data.quantity) &&
      (data.quantity as number) > 0
        ? (data.quantity as number)
        : 1;

    if (quantity > product.stock) {
      throw new Error(
        `Only ${product.stock} unit(s) of this product are left in stock.`
      );
    }

    const location = data.location;

    if (
      !location ||
      !location.county?.trim() ||
      !location.town?.trim() ||
      !location.place?.trim() ||
      !location.road?.trim()
    ) {
      throw new Error(
        "Delivery location (county, town, place and road) is required."
      );
    }

    const created = await prisma.order.create({
      data: {
        productId: data.productId,

        quantity,
        customerNote:
          data.customerNote?.trim() || null,

        customerName:
          data.customerName.trim(),

        customerPhone:
          data.customerPhone.trim(),

        customerEmail:
          data.customerEmail?.trim() || null,

        locationCounty: location.county.trim(),
        locationTown: location.town.trim(),
        locationPlace: location.place.trim(),
        locationRoad: location.road.trim(),
        locationBuilding:
          location.building?.trim() || null,
        locationLat:
          typeof location.lat === "number"
            ? location.lat
            : null,
        locationLng:
          typeof location.lng === "number"
            ? location.lng
            : null,

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

    return this.formatOrder(created);
  }

  /* =========================================================
     ADMIN ORDERS
  ========================================================= */

  async getAdminOrders() {
    const orders = await prisma.order.findMany({
      include: {
        product: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) =>
      this.formatOrder(order)
    );
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
      return this.formatOrder(order);
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

    return this.formatOrder(updatedOrder);
  }

  /* =========================================================
     UPDATE ORDER NOTE
  ========================================================= */

  async updateOrderNote(
    id: string,
    note: string
  ) {
    const updatedOrder = await prisma.order.update({
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

    return this.formatOrder(updatedOrder);
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

    const updatedOrder = await prisma.order.update({
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

    return this.formatOrder(updatedOrder);
  }
}