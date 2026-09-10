import { Router } from "express";

import { ShopController } from "./shop.controller.js";
import { shopUpload } from "./shop.upload.js";

const router = Router();

const shopController = new ShopController();

/* =========================================================
   PUBLIC SHOP
========================================================= */

router.get(
  "/products",
  shopController.getProducts
);

router.post(
  "/orders",
  shopController.createOrder
);

/* =========================================================
   ADMIN PRODUCTS
========================================================= */

router.get(
  "/admin/products",
  shopController.getAdminProducts
);

router.post(
  "/admin/products",
  shopController.createProduct
);

router.put(
  "/admin/products/:id",
  shopController.updateProduct
);

router.delete(
  "/admin/products/:id",
  shopController.deleteProduct
);

/* =========================================================
   ADMIN PRODUCT IMAGE UPLOAD
========================================================= */

router.post(
  "/admin/products/upload-image",
  shopUpload.single("image"),
  shopController.uploadProductImage
);

/* =========================================================
   ADMIN ORDERS
========================================================= */

router.get(
  "/admin/orders",
  shopController.getAdminOrders
);

router.post(
  "/admin/orders/:id/confirm-payment",
  shopController.confirmPayment
);

router.put(
  "/admin/orders/:id/note",
  shopController.updateOrderNote
);

router.put(
  "/admin/orders/:id/status",
  shopController.updateOrderStatus
);

export const shopRoutes = router;
