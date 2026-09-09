import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class ShopService {
    async getAllProducts() {
        return await prisma.product.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllProductsAdmin() {
        return await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createProduct(data) {
        return await prisma.product.create({ data });
    }
    async updateProduct(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }
    async deleteProduct(id) {
        return await prisma.product.delete({
            where: { id },
        });
    }
    async createOrder(data) {
        return await prisma.order.create({
            data,
            include: { product: true },
        });
    }
    async getAdminOrders() {
        return await prisma.order.findMany({
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}
