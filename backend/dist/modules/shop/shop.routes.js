import { Router } from "express";
import { ShopController } from "./shop.controller.js";
const router = Router();
const shopController = new ShopController();
/* =========================================================
   PUBLIC SHOP
========================================================= */
router.get("/products", shopController.getProducts);
router.post("/orders", shopController.createOrder);
/* =========================================================
   ADMIN PRODUCTS
========================================================= */
router.get("/admin/products", shopController.getAdminProducts);
router.post("/admin/products", shopController.createProduct);
router.put("/admin/products/:id", shopController.updateProduct);
router.delete("/admin/products/:id", shopController.deleteProduct);
/* =========================================================
   ADMIN ORDERS
========================================================= */
router.get("/admin/orders", shopController.getAdminOrders);
router.post("/admin/orders/:id/confirm-payment", shopController.confirmPayment);
router.put("/admin/orders/:id/note", shopController.updateOrderNote);
router.put("/admin/orders/:id/status", shopController.updateOrderStatus);
export const shopRoutes = router;
