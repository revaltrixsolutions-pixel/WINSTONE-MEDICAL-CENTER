import { ShopService } from "./shop.service.js";
const shopService = new ShopService();
export class ShopController {
    async getProducts(req, res) {
        try {
            const products = await shopService.getAllProducts();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAdminProducts(req, res) {
        try {
            const products = await shopService.getAllProductsAdmin();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createProduct(req, res) {
        try {
            const product = await shopService.createProduct(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await shopService.updateProduct(id, req.body);
            res.json(product);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await shopService.deleteProduct(id);
            res.json({ message: 'Product deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createOrder(req, res) {
        try {
            const order = await shopService.createOrder(req.body);
            res.status(201).json(order);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getAdminOrders(req, res) {
        try {
            const orders = await shopService.getAdminOrders();
            res.json(orders);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
