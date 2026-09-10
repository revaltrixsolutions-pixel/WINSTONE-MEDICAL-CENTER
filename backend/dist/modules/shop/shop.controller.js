import { ShopService } from "./shop.service.js";
const shopService = new ShopService();
export class ShopController {
    // =========================================================
    // PUBLIC PRODUCTS
    // =========================================================
    getProducts = async (_req, res) => {
        try {
            const products = await shopService.getAllProducts();
            res.status(200).json(products);
        }
        catch (error) {
            console.error("Get products error:", error);
            res.status(500).json({
                success: false,
                error: error?.message || "Failed to load products.",
            });
        }
    };
    // =========================================================
    // ADMIN PRODUCTS
    // =========================================================
    getAdminProducts = async (_req, res) => {
        try {
            const products = await shopService.getAllProductsAdmin();
            res.status(200).json(products);
        }
        catch (error) {
            console.error("Get admin products error:", error);
            res.status(500).json({
                success: false,
                error: error?.message || "Failed to load admin products.",
            });
        }
    };
    // =========================================================
    // CREATE PRODUCT
    // =========================================================
    createProduct = async (req, res) => {
        try {
            const product = await shopService.createProduct(req.body);
            res.status(201).json({
                success: true,
                message: "Product created successfully.",
                product,
            });
        }
        catch (error) {
            console.error("Create product error:", error);
            res.status(400).json({
                success: false,
                error: error?.message || "Failed to create product.",
            });
        }
    };
    // =========================================================
    // UPDATE PRODUCT
    // =========================================================
    updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Product ID is required.",
                });
                return;
            }
            const product = await shopService.updateProduct(id, req.body);
            res.status(200).json({
                success: true,
                message: "Product updated successfully.",
                product,
            });
        }
        catch (error) {
            console.error("Update product error:", error);
            res.status(400).json({
                success: false,
                error: error?.message || "Failed to update product.",
            });
        }
    };
    // =========================================================
    // DELETE PRODUCT
    // =========================================================
    deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Product ID is required.",
                });
                return;
            }
            await shopService.deleteProduct(id);
            res.status(200).json({
                success: true,
                message: "Product deleted successfully.",
            });
        }
        catch (error) {
            console.error("Delete product error:", error);
            res.status(400).json({
                success: false,
                error: error?.message || "Failed to delete product.",
            });
        }
    };
    // =========================================================
    // CREATE ORDER
    // =========================================================
    createOrder = async (req, res) => {
        try {
            const order = await shopService.createOrder(req.body);
            res.status(201).json({
                success: true,
                message: "Order created successfully.",
                order,
            });
        }
        catch (error) {
            console.error("Create order error:", error);
            res.status(400).json({
                success: false,
                error: error?.message || "Failed to create order.",
            });
        }
    };
    // =========================================================
    // ADMIN ORDERS
    // =========================================================
    getAdminOrders = async (_req, res) => {
        try {
            const orders = await shopService.getAdminOrders();
            res.status(200).json(orders);
        }
        catch (error) {
            console.error("Get admin orders error:", error);
            res.status(500).json({
                success: false,
                error: error?.message || "Failed to load orders.",
            });
        }
    };
    // =========================================================
    // CONFIRM PAYMENT
    // =========================================================
    confirmPayment = async (req, res) => {
        try {
            const { id } = req.params;
            const { note } = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Order ID is required.",
                });
                return;
            }
            const order = await shopService.confirmPayment(id, {
                note,
            });
            res.status(200).json({
                success: true,
                message: "Payment confirmed successfully.",
                order,
            });
        }
        catch (error) {
            console.error("Confirm payment error:", error);
            res.status(400).json({
                success: false,
                error: error?.message || "Failed to confirm payment.",
            });
        }
    };
    // =========================================================
    // UPDATE ORDER NOTE
    // =========================================================
    updateOrderNote = async (req, res) => {
        try {
            const { id } = req.params;
            const { note } = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Order ID is required.",
                });
                return;
            }
            const order = await shopService.updateOrderNote(id, note);
            res.status(200).json({
                success: true,
                message: "Order note updated successfully.",
                order,
            });
        }
        catch (error) {
            console.error("Update order note error:", error);
            res.status(400).json({
                success: false,
                error: error?.message ||
                    "Failed to update order note.",
            });
        }
    };
    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================
    updateOrderStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Order ID is required.",
                });
                return;
            }
            if (!status) {
                res.status(400).json({
                    success: false,
                    error: "Order status is required.",
                });
                return;
            }
            const order = await shopService.updateOrderStatus(id, status);
            res.status(200).json({
                success: true,
                message: "Order status updated successfully.",
                order,
            });
        }
        catch (error) {
            console.error("Update order status error:", error);
            res.status(400).json({
                success: false,
                error: error?.message ||
                    "Failed to update order status.",
            });
        }
    };
    // =========================================================
    // UPLOAD PRODUCT IMAGE
    // =========================================================
    uploadProductImage = async (req, res) => {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: "No image uploaded.",
                });
                return;
            }
            const configuredBaseUrl = process.env.PUBLIC_API_URL ||
                process.env.RENDER_EXTERNAL_URL;
            const baseUrl = (configuredBaseUrl ||
                `${req.protocol}://${req.get("host")}`)
                .replace(/^http:\/\//i, "https://")
                .replace(/\/+$/, "");
            const imageUrl = `${baseUrl}/uploads/shop/${req.file.filename}`;
            res.status(201).json({
                success: true,
                message: "Product image uploaded successfully.",
                imageUrl,
            });
        }
        catch (error) {
            console.error("Product image upload error:", error);
            res.status(400).json({
                success: false,
                error: error?.message ||
                    "Failed to upload product image.",
            });
        }
    };
}
