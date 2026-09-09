import { Router } from "express";
import { ShopController } from "./shop.controller.js";

const router = Router();

const shopController = new ShopController();

/**
 * =========================================================
 * PUBLIC SHOP ROUTES
 * =========================================================
 */

// Get all active products
router.get("/products", shopController.getProducts);

// Create customer order
router.post("/orders", shopController.createOrder);

/**
 * =========================================================
 * ADMIN SHOP ROUTES
 * =========================================================
 */

// Get all products for admin
router.get("/admin/products", shopController.getAdminProducts);

// Create product
router.post("/admin/products", shopController.createProduct);

// Update product
router.put("/admin/products/:id", shopController.updateProduct);

// Delete product
router.delete("/admin/products/:id", shopController.deleteProduct);

// Get all orders for admin
router.get("/admin/orders", shopController.getAdminOrders);

export const shopRoutes = router;