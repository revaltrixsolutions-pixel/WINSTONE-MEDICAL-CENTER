import React, { useEffect, useState } from "react";
import { shopApi } from "../../../../api/shop";
import type { Product } from "../../../../api/shop";

interface ProductForm {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  imageUrls: string[];
  active: boolean;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: string;
  paymentId?: string;
  deliveryType: string;
  createdAt: string;
  product?: {
    name: string;
  };
}

const emptyForm: ProductForm = {
  name: "",
  shortDescription: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrls: [""],
  active: true,
};

export const ShopManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "orders">(
    "products"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductForm>(emptyForm);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  const loadProducts = async () => {
    try {
      const data = await shopApi.getAdminProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Failed to load products:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to load products"
      );
    }
  };

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const loadOrders = async () => {
    try {
      const data = await shopApi.getAdminOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Failed to load orders:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to load orders"
      );
    }
  };

  /* =========================================================
     LOAD ALL DATA
  ========================================================= */

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    await Promise.allSettled([
      loadProducts(),
      loadOrders(),
    ]);

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     OPEN MODAL
  ========================================================= */

  const openCreateModal = () => {
    setFormData(emptyForm);
    setError(null);
    setIsModalOpen(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Product description is required.");
      return;
    }

    if (formData.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (formData.stock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        shortDescription:
          formData.shortDescription.trim() || undefined,
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrls: formData.imageUrls.filter(
          (url) => url.trim() !== ""
        ),
        active: formData.active,
      };

      await shopApi.createProduct(payload);

      setIsModalOpen(false);
      setFormData(emptyForm);

      await loadProducts();

      alert("Product saved successfully.");
    } catch (err: any) {
      console.error("Error saving product:", err);

      alert(
        "Error saving product: " +
          (err?.response?.data?.error ||
            err?.message ||
            "Unknown error")
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     UPDATE IMAGE URL
  ========================================================= */

  const updateImageUrl = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      imageUrls: [value],
    }));
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full">
      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError(null)}
              className="font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="mb-6 flex gap-4 border-b pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "products"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Products Inventory
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "orders"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {activeTab === "products" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Product List
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage products available in your online shop.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              Add New Product
            </button>
          </div>

          <div className="overflow-x-auto rounded border bg-white shadow">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products found.
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3">Name</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">
                        {product.name}
                      </td>

                      <td className="p-3">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      <td className="p-3">
                        {product.stock}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            product.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          ORDERS
      ===================================================== */}

      {activeTab === "orders" && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Incoming Orders
          </h2>

          <div className="overflow-x-auto rounded border bg-white shadow">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No customer orders found.
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Delivery</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <div className="font-medium">
                          {order.customerName}
                        </div>

                        <div className="text-xs text-gray-500">
                          {order.customerPhone}
                        </div>

                        {order.customerEmail && (
                          <div className="text-xs text-gray-500">
                            {order.customerEmail}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        {order.product?.name || "N/A"}
                      </td>

                      <td className="p-3">
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="p-3 text-xs font-mono">
                        {order.paymentId || "None"}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            order.deliveryType ===
                            "WHATSAPP_1HR"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.deliveryType}
                        </span>
                      </td>

                      <td className="p-3 text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          ADD PRODUCT MODAL
      ===================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Add Product
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="text-xl text-gray-500 hover:text-gray-800 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}

              <div>
                <label className="block text-sm font-medium">
                  Name
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded border p-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* Short Description */}

              <div>
                <label className="block text-sm font-medium">
                  Short Description
                </label>

                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription:
                        e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded border p-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}

              <div>
                <label className="block text-sm font-medium">
                  Full Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded border p-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* Price + Stock */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Price ($)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price:
                          Number(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full rounded border p-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock:
                          Number(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full rounded border p-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Image URL */}

              <div>
                <label className="block text-sm font-medium">
                  Image URL
                </label>

                <input
                  type="text"
                  value={formData.imageUrls[0] || ""}
                  onChange={(e) =>
                    updateImageUrl(e.target.value)
                  }
                  placeholder="https://..."
                  className="mt-1 w-full rounded border p-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* Active */}

              <div className="flex items-center gap-2">
                <input
                  id="product-active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      active: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />

                <label
                  htmlFor="product-active"
                  className="text-sm font-medium"
                >
                  Product is active
                </label>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded bg-gray-300 px-4 py-2 font-medium hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManager;