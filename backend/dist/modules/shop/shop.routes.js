import { Router } from 'express';
import { ShopController } from "./shop.controller.js";
const router = Router();
const shopController = new ShopController();
// Public routes
router.get('/products', shopController.getProducts);
router.post('/orders', shopController.createOrder);
// Admin routes
router.get('/admin/products', shopController.getAdminProducts);
router.post('/admin/products', shopController.createProduct);
router.put('/admin/products/:id', shopController.updateProduct);
router.delete('/admin/products/:id', shopController.deleteProduct);
router.get('/admin/orders', shopController.getAdminOrders);
export const shopRoutes = router;
