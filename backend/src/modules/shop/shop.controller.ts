import type { Request, Response } from "express";
import { ShopService } from "./shop.service.js";

const shopService = new ShopService();

export class ShopController {
  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await shopService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAdminProducts = async (req: Request, res: Response) => {
    try {
      const products = await shopService.getAllProductsAdmin();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await shopService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await shopService.updateProduct(id, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await shopService.deleteProduct(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const order = await shopService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAdminOrders = async (req: Request, res: Response) => {
    try {
      const orders = await shopService.getAdminOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}