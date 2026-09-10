import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Edit,
  ExternalLink,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  ClipboardCheck,
  Clock,
  Truck,
  CreditCard,
  Upload,
  ImagePlus,
  Loader2,
  MapPin,
  Hash,
  StickyNote,
  Navigation,
} from "lucide-react";

import { shopApi } from "../../../../api/shop";
import type { Order, Product } from "../../../../api/shop";
import { getImageUrl } from "../../../../api/axios";

/* =========================================================
   TYPES
========================================================= */

interface ProductForm {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  imageUrls: string[];
  active: boolean;
}

/* =========================================================
   CONSTANTS
========================================================= */

const emptyForm: ProductForm = {
  name: "",
  shortDescription: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrls: [],
  active: true,
};

/* =========================================================
   API / PUBLIC URL
========================================================= */

const getPublicProductUrl = (productId: string) => {
  const frontendBase =
    import.meta.env.VITE_FRONTEND_URL ||
    window.location.origin;

  return `${frontendBase}/shop/product/${productId}`;
};

/* =========================================================
   HELPERS
========================================================= */

const getCustomerName = (order: Order) =>
  order.customer?.name ||
  order.customerName ||
  "Customer";

const getCustomerPhone = (order: Order) =>
  order.customer?.phone ||
  order.customerPhone ||
  "";

const getCustomerEmail = (order: Order) =>
  order.customer?.email ||
  order.customerEmail ||
  "";

const getOrderQuantity = (order: Order) =>
  Number.isFinite(order.quantity)
    ? (order.quantity as number)
    : 1;

const getOrderNote = (order: Order) =>
  order.customerNote || order.note || "";

const getOrderLocation = (
  order: Order
): NonNullable<Order["location"]> =>
  order.location || {};

const getOrderLocationText = (order: Order) => {
  const location = getOrderLocation(order);

  const parts = [
    location.county,
    location.town,
    location.place,
    location.road,
    location.building,
  ].filter((part) => part && part.trim());

  return parts.length
    ? parts.join(", ")
    : "No delivery address provided";
};

const getOrderMapsLink = (order: Order) => {
  const location = getOrderLocation(order);

  if (
    location.lat === undefined ||
    location.lat === null ||
    location.lng === undefined ||
    location.lng === null
  ) {
    return null;
  }

  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
};

const formatPaymentMethod = (value?: string) => {
  if (!value) return "Unknown";

  if (value === "PAY_NOW") return "Pay Now";
  if (value === "PAY_LATTER") return "Pay Later";
  if (value === "PAY_LATER") return "Pay Later";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const formatDeliveryType = (value?: string) => {
  if (!value) return "Unknown";

  if (value === "WHATSAPP_1HR") {
    return "WhatsApp / 1 Hour";
  }

  if (value === "STANDARD_5HR") {
    return "Standard / 5 Hours";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const formatStatus = (value?: string) => {
  if (!value) return "Pending";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const getErrorMessage = (
  error: any,
  fallback: string
) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

/* =========================================================
   COMPONENT
========================================================= */

export const ShopManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [activeTab, setActiveTab] = useState<
    "products" | "orders"
  >("products");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<ProductForm>(emptyForm);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [confirmationNote, setConfirmationNote] =
    useState("");

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [copiedProductId, setCopiedProductId] =
    useState<string | null>(null);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  const loadProducts = async () => {
    try {
      const data =
        await shopApi.getAdminProducts();

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      throw err;
    }
  };

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const loadOrders = async () => {
    try {
      const data =
        await shopApi.getAdminOrders();

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load orders:",
        err
      );

      throw err;
    }
  };

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    const results =
      await Promise.allSettled([
        loadProducts(),
        loadOrders(),
      ]);

    const failed = results.find(
      (result) =>
        result.status === "rejected"
    );

    if (
      failed &&
      failed.status === "rejected"
    ) {
      setError(
        getErrorMessage(
          failed.reason,
          "Failed to load shop data."
        )
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const term =
      searchTerm.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) =>
      [
        product.name,
        product.description,
        product.shortDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [products, searchTerm]);

  /* =========================================================
     CREATE PRODUCT MODAL
  ========================================================= */

  const openCreateModal = () => {
    setEditingProduct(null);

    setFormData({
      ...emptyForm,
      imageUrls: [],
    });

    setError(null);
    setIsModalOpen(true);
  };

  /* =========================================================
     EDIT PRODUCT MODAL
  ========================================================= */

  const openEditModal = (
    product: Product
  ) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      shortDescription:
        product.shortDescription || "",
      description:
        product.description || "",
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      imageUrls:
        product.imageUrls?.filter(
          (url) => url?.trim()
        ) || [],
      active: Boolean(product.active),
    });

    setError(null);
    setIsModalOpen(true);
  };

  /* =========================================================
     CLOSE PRODUCT MODAL
  ========================================================= */

  const closeModal = () => {
    if (isSaving || isUploadingImage) {
      return;
    }

    setIsModalOpen(false);
    setEditingProduct(null);

    setFormData({
      ...emptyForm,
      imageUrls: [],
    });
  };

  /* =========================================================
     UPLOAD PRODUCT IMAGE
  ========================================================= */

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG, WEBP and GIF images are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Image must be smaller than 5MB."
      );
      return;
    }

    setIsUploadingImage(true);

    try {
      const result =
        await shopApi.uploadProductImage(
          file
        );

      if (!result?.imageUrl) {
        throw new Error(
          "The server did not return an image URL."
        );
      }

      setFormData((previous) => ({
        ...previous,
        imageUrls: [
          ...previous.imageUrls,
          result.imageUrl,
        ],
      }));
    } catch (err: any) {
      console.error(
        "Image upload error:",
        err
      );

      alert(
        "Failed to upload image: " +
          getErrorMessage(
            err,
            "Unknown error"
          )
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  /* =========================================================
     REMOVE PRODUCT IMAGE
  ========================================================= */

  const removeImage = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      imageUrls:
        previous.imageUrls.filter(
          (_, imageIndex) =>
            imageIndex !== index
        ),
    }));
  };

  /* =========================================================
     SAVE PRODUCT
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      alert(
        "Product description is required."
      );
      return;
    }

    if (formData.price < 0) {
      alert(
        "Price cannot be negative."
      );
      return;
    }

    if (formData.stock < 0) {
      alert(
        "Stock cannot be negative."
      );
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),

        shortDescription:
          formData.shortDescription.trim() ||
          undefined,

        description:
          formData.description.trim(),

        price: Number(formData.price),

        stock: Number(formData.stock),

        imageUrls:
          formData.imageUrls.filter(
            (url) => url.trim() !== ""
          ),

        active: formData.active,
      };

      if (editingProduct) {
        await shopApi.updateProduct(
          editingProduct.id,
          payload
        );
      } else {
        await shopApi.createProduct(
          payload
        );
      }

      await loadProducts();

      closeModal();

      alert(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully."
      );
    } catch (err: any) {
      console.error(
        "Error saving product:",
        err
      );

      alert(
        "Error saving product: " +
          getErrorMessage(
            err,
            "Unknown error"
          )
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  const handleDeleteProduct = async (
    product: Product
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      await shopApi.deleteProduct(
        product.id
      );

      await loadProducts();

      alert(
        "Product deleted successfully."
      );
    } catch (err: any) {
      console.error(
        "Error deleting product:",
        err
      );

      alert(
        "Failed to delete product: " +
          getErrorMessage(
            err,
            "Unknown error"
          )
      );
    }
  };

  /* =========================================================
     COPY PRODUCT LINK
  ========================================================= */

  const copyProductLink = async (
    productId: string
  ) => {
    const url =
      getPublicProductUrl(productId);

    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopiedProductId(productId);

      window.setTimeout(() => {
        setCopiedProductId(null);
      }, 2000);
    } catch (copyError) {
      console.error(
        "Unable to copy link:",
        copyError
      );

      window.prompt(
        "Copy this product link:",
        url
      );
    }
  };

  /* =========================================================
     OPEN PUBLIC PRODUCT
  ========================================================= */

  const openProductLink = (
    productId: string
  ) => {
    window.open(
      getPublicProductUrl(productId),
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const openWhatsApp = (
    order: Order,
    message?: string
  ) => {
    const phone =
      getCustomerPhone(order);

    if (!phone) {
      alert(
        "This customer has no phone number."
      );
      return;
    }

    const cleanedPhone =
      phone.replace(/[^\d]/g, "");

    if (!cleanedPhone) {
      alert(
        "The customer's phone number is invalid."
      );
      return;
    }

    const defaultMessage =
      `Hello ${getCustomerName(order)},\n\n` +
      `This is Winston Medical Centre regarding your order ` +
      `#${order.id}.\n\n` +
      `Product: ${
        order.product?.name ||
        "Your order"
      }\n` +
      `Payment: ${formatPaymentMethod(
        order.paymentMethod
      )}\n` +
      `Delivery: ${formatDeliveryType(
        order.deliveryType
      )}\n\n` +
      `Thank you for ordering with us.`;

    const whatsappUrl =
      `https://wa.me/${cleanedPhone}?text=` +
      encodeURIComponent(
        message || defaultMessage
      );

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     EMAIL
  ========================================================= */

  const openEmail = (
    order: Order
  ) => {
    const email =
      getCustomerEmail(order);

    if (!email) {
      alert(
        "This customer has no email address."
      );
      return;
    }

    const subject =
      `Order #${order.id} - Winston Medical Centre`;

    const body =
      `Hello ${getCustomerName(order)},\n\n` +
      `We are contacting you regarding your order ` +
      `#${order.id}.\n\n` +
      `Product: ${
        order.product?.name ||
        "Your order"
      }\n` +
      `Payment: ${formatPaymentMethod(
        order.paymentMethod
      )}\n` +
      `Delivery: ${formatDeliveryType(
        order.deliveryType
      )}\n\n` +
      `Thank you for choosing Winston Medical Centre.`;

    window.location.href =
      `mailto:${email}?subject=` +
      encodeURIComponent(subject) +
      `&body=` +
      encodeURIComponent(body);
  };

  /* =========================================================
     CALL CUSTOMER
  ========================================================= */

  const callCustomer = (
    order: Order
  ) => {
    const phone =
      getCustomerPhone(order);

    if (!phone) {
      alert(
        "This customer has no phone number."
      );
      return;
    }

    window.location.href =
      `tel:${phone}`;
  };

  /* =========================================================
     OPEN CONFIRMATION
  ========================================================= */

  const openConfirmation = (
    order: Order
  ) => {
    setSelectedOrder(order);

    setConfirmationNote(
      order.adminNote ||
        order.note ||
        ""
    );
  };

  /* =========================================================
     CONFIRM PAYMENT
  ========================================================= */

  const confirmPayment = async () => {
    if (!selectedOrder) return;

    setIsConfirming(true);

    try {
      const result =
        await shopApi.confirmPayment(
          selectedOrder.id,
          {
            note:
              confirmationNote.trim() ||
              undefined,
          }
        );

      const updatedOrder =
        result?.order || result;

      setOrders((previous) =>
        previous.map((order) =>
          order.id === selectedOrder.id
            ? {
                // Spread the full backend response first so every
                // field it returns (quantity, customerNote, location,
                // product, etc.) is kept, then layer local fallbacks
                // only for fields the API might omit.
                ...order,
                ...updatedOrder,
                paymentStatus:
                  updatedOrder?.paymentStatus ||
                  "CONFIRMED",
                status:
                  updatedOrder?.status ||
                  "CONFIRMED",
                adminNote:
                  updatedOrder?.adminNote ??
                  confirmationNote.trim(),
                confirmedAt:
                  updatedOrder?.confirmedAt ||
                  new Date().toISOString(),
              }
            : order
        )
      );

      const orderForMessage: Order = {
        ...selectedOrder,
        ...updatedOrder,
        paymentStatus: "CONFIRMED",
        status: "CONFIRMED",
        adminNote:
          confirmationNote.trim(),
      };

      setSelectedOrder(null);
      setConfirmationNote("");

      openWhatsApp(
        orderForMessage,
        `Hello ${getCustomerName(
          orderForMessage
        )},\n\n` +
          `Good news! Your payment for order #${orderForMessage.id} ` +
          `has been confirmed by Winston Medical Centre.\n\n` +
          `Product: ${
            orderForMessage.product?.name ||
            "Your order"
          }\n` +
          `Delivery: ${formatDeliveryType(
            orderForMessage.deliveryType
          )}\n\n` +
          `${
            confirmationNote.trim()
              ? `Note from our team: ${confirmationNote.trim()}\n\n`
              : ""
          }` +
          `Thank you for your order. We will proceed with your delivery.`
      );
    } catch (err: any) {
      console.error(
        "Failed to confirm payment:",
        err
      );

      alert(
        "Failed to confirm payment: " +
          getErrorMessage(
            err,
            "Unknown error"
          )
      );
    } finally {
      setIsConfirming(false);
    }
  };

  /* =========================================================
     PAYMENT STATUS
  ========================================================= */

  const isPaymentConfirmed = (
    order: Order
  ) => {
    const status =
      `${order.paymentStatus || ""} ${
        order.status || ""
      }`.toUpperCase();

    return (
      status.includes("CONFIRMED") ||
      status.includes("PAID")
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Shop Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage products, orders, payments
              and customer communication.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              isLoading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <div className="font-semibold">
                Shop API Error
              </div>

              <div className="mt-1 break-words text-sm">
                {error}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="font-bold"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="flex flex-wrap gap-2 rounded-xl border bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() =>
            setActiveTab("products")
          }
          className={`rounded-lg px-5 py-3 font-semibold transition ${
            activeTab === "products"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Products
          <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("orders")
          }
          className={`rounded-lg px-5 py-3 font-semibold transition ${
            activeTab === "orders"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Orders
          <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
            {orders.length}
          </span>
        </button>
      </div>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {activeTab === "products" && (
        <div className="space-y-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Product Inventory
              </h2>

              <p className="text-sm text-gray-500">
                Every product has a direct public
                buying link for advertisements and
                marketing.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search products..."
              className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* PRODUCT LIST */}

          {isLoading ? (
            <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
              Loading products...
            </div>
          ) : filteredProducts.length ===
            0 ? (
            <div className="rounded-xl border bg-white p-12 text-center">
              <Package
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-700">
                No products found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first product to
                start selling.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredProducts.map(
                (product) => {
                  const publicUrl =
                    getPublicProductUrl(
                      product.id
                    );

                  return (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      {/* IMAGE */}

                      {product.imageUrls?.[0] ? (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img
                            src={
                              getImageUrl(
                                product.imageUrls[0]
                              )
                            }
                            alt={
                              product.name
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
                          <Package
                            size={48}
                          />
                        </div>
                      )}

                      <div className="space-y-4 p-5">

                        {/* PUBLIC LINK */}

                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wide text-blue-700">
                              Public Buying Link
                            </span>

                            <ExternalLink
                              size={15}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="flex gap-2">
                            <input
                              readOnly
                              value={
                                publicUrl
                              }
                              className="min-w-0 flex-1 rounded border bg-white px-3 py-2 text-xs text-gray-700 outline-none"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                copyProductLink(
                                  product.id
                                )
                              }
                              className="inline-flex shrink-0 items-center gap-1 rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              <Copy
                                size={14}
                              />

                              {copiedProductId ===
                              product.id
                                ? "Copied"
                                : "Copy"}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openProductLink(
                                product.id
                              )
                            }
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                          >
                            <ExternalLink
                              size={13}
                            />
                            Open public product page
                          </button>
                        </div>

                        {/* PRODUCT NAME */}

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {product.name}
                            </h3>

                            {product.shortDescription && (
                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  product.shortDescription
                                }
                              </p>
                            )}
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                              product.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        {/* DETAILS */}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-xs text-gray-500">
                              Price
                            </div>

                            <div className="mt-1 text-lg font-bold">
                              KSh 
                              {Number(
                                product.price
                              ).toFixed(
                                2
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-xs text-gray-500">
                              Stock
                            </div>

                            <div className="mt-1 text-lg font-bold">
                              {
                                product.stock
                              }
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap gap-2 border-t pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                          >
                            <Edit
                              size={16}
                            />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              copyProductLink(
                                product.id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                          >
                            <Copy
                              size={16}
                            />
                            Copy Link
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2
                              size={16}
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          ORDERS
      ===================================================== */}

      {activeTab === "orders" && (
        <div className="space-y-5">

          <div>
            <h2 className="text-xl font-bold">
              Customer Orders
            </h2>

            <p className="text-sm text-gray-500">
              Confirm payments and communicate
              directly with customers.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl border bg-white p-12 text-center">
              <ClipboardCheck
                size={42}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold">
                No customer orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                New online orders will appear
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const confirmed =
                  isPaymentConfirmed(
                    order
                  );

                const phone =
                  getCustomerPhone(order);

                const email =
                  getCustomerEmail(order);

                const quantity =
                  getOrderQuantity(order);

                const orderNote =
                  getOrderNote(order);

                const locationText =
                  getOrderLocationText(
                    order
                  );

                const mapsLink =
                  getOrderMapsLink(order);

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-xl border bg-white shadow-sm"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-3 border-b bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold">
                            Order #{order.id}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              confirmed
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {confirmed
                              ? "Payment Confirmed"
                              : "Payment Pending"}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <Clock
                            size={13}
                          />

                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString()
                            : "Date unavailable"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {formatStatus(
                            order.status
                          )}
                        </div>

                        {order.confirmedAt && (
                          <div className="mt-1 text-xs text-gray-500">
                            Confirmed{" "}
                            {new Date(
                              order.confirmedAt
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ORDER CONTENT */}

                    <div className="grid gap-6 p-5 lg:grid-cols-3">

                      {/* CUSTOMER */}

                      <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                          Customer
                        </h3>

                        <div className="font-semibold text-gray-900">
                          {getCustomerName(
                            order
                          )}
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          {phone ||
                            "No phone number"}
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          {email ||
                            "No email address"}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">

                          <button
                            type="button"
                            disabled={!phone}
                            onClick={() =>
                              openWhatsApp(
                                order
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <MessageCircle
                              size={15}
                            />
                            WhatsApp
                          </button>

                          <button
                            type="button"
                            disabled={!email}
                            onClick={() =>
                              openEmail(
                                order
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Mail size={15} />
                            Email
                          </button>

                          <button
                            type="button"
                            disabled={!phone}
                            onClick={() =>
                              callCustomer(
                                order
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Phone
                              size={15}
                            />
                            Call
                          </button>
                        </div>
                      </div>

                      {/* PRODUCT */}

                      <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                          Order
                        </h3>

                        <div className="flex gap-3">
                          {order.product
                            ?.imageUrls?.[0] && (
                            <img
                              src={
                                getImageUrl(
                                  order.product
                                    .imageUrls[0]
                                )
                              }
                              alt={
                                order.product
                                  .name
                              }
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          )}

                          <div>
                            <div className="font-semibold">
                              {order
                                .product
                                ?.name ||
                                "Product unavailable"}
                            </div>

                            {order.product
                              ?.price !==
                              undefined && (
                              <div className="mt-1 font-bold">
                                KSh 
                                {Number(
                                  order
                                    .product
                                    .price
                                ).toFixed(
                                  2
                                )}
                              </div>
                            )}

                            {order.product
                              ?.shortDescription && (
                              <div className="mt-1 text-xs text-gray-500">
                                {
                                  order
                                    .product
                                    .shortDescription
                                }
                              </div>
                            )}

                            {order.product
                              ?.stock !==
                              undefined && (
                              <div className="mt-1 text-xs text-gray-500">
                                Stock remaining:{" "}
                                <strong>
                                  {
                                    order
                                      .product
                                      .stock
                                  }
                                </strong>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* QUANTITY */}

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                          <Hash size={15} />
                          <span>
                            Quantity:{" "}
                            <strong>
                              {quantity}
                            </strong>
                          </span>
                        </div>

                        {/* ORDER TOTAL */}

                        {order.product
                          ?.price !==
                          undefined && (
                          <div className="mt-1 text-sm text-gray-700">
                            Order Total:{" "}
                            <strong>
                              KSh 
                              {(
                                Number(
                                  order
                                    .product
                                    .price
                                ) * quantity
                              ).toFixed(2)}
                            </strong>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <Truck
                            size={16}
                          />

                          {formatDeliveryType(
                            order.deliveryType
                          )}
                        </div>

                        {/* CUSTOMER ORDER NOTE */}

                        {orderNote && (
                          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-blue-800">
                              <StickyNote
                                size={13}
                              />
                              Customer Note
                            </div>

                            <div className="mt-1 text-sm text-blue-900">
                              {orderNote}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* PAYMENT */}

                      <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                          Payment
                        </h3>

                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={17}
                            className="text-gray-500"
                          />

                          <span className="font-medium">
                            {formatPaymentMethod(
                              order.paymentMethod
                            )}
                          </span>
                        </div>

                        <div className="mt-2 break-all rounded-lg bg-gray-50 p-3 text-xs">
                          <div className="text-gray-500">
                            Payment ID
                          </div>

                          <div className="mt-1 font-mono">
                            {order.paymentId ||
                              "No payment ID"}
                          </div>
                        </div>

                        {order.adminNote && (
                          <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <div className="text-xs font-bold uppercase text-yellow-800">
                              Admin Note
                            </div>

                            <div className="mt-1 text-sm text-yellow-900">
                              {
                                order.adminNote
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        DELIVERY LOCATION (full data captured at checkout)
                    ================================================= */}

                    <div className="border-t bg-gray-50 p-5">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                        <MapPin size={15} />
                        Delivery Location
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-white p-3">
                          <div className="text-xs text-gray-500">
                            County
                          </div>
                          <div className="mt-1 text-sm font-semibold text-gray-800">
                            {getOrderLocation(
                              order
                            ).county ||
                              "�"}
                          </div>
                        </div>

                        <div className="rounded-lg border bg-white p-3">
                          <div className="text-xs text-gray-500">
                            Town
                          </div>
                          <div className="mt-1 text-sm font-semibold text-gray-800">
                            {getOrderLocation(
                              order
                            ).town || "�"}
                          </div>
                        </div>

                        <div className="rounded-lg border bg-white p-3">
                          <div className="text-xs text-gray-500">
                            Place/Area
                          </div>
                          <div className="mt-1 text-sm font-semibold text-gray-800">
                            {getOrderLocation(
                              order
                            ).place || "�"}
                          </div>
                        </div>

                        <div className="rounded-lg border bg-white p-3">
                          <div className="text-xs text-gray-500">
                            Road/Street
                          </div>
                          <div className="mt-1 text-sm font-semibold text-gray-800">
                            {getOrderLocation(
                              order
                            ).road || "�"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border bg-white p-3">
                          <div className="text-xs text-gray-500">
                            Building/House Name
                          </div>
                          <div className="mt-1 text-sm font-semibold text-gray-800">
                            {getOrderLocation(
                              order
                            ).building ||
                              "�"}
                          </div>
                        </div>

                        <div className="rounded-lg border bg-white p-3">
                          <div className="text-xs text-gray-500">
                            Full Address
                          </div>
                          <div className="mt-1 text-sm font-semibold text-gray-800">
                            {locationText}
                          </div>
                        </div>
                      </div>

                      {mapsLink ? (
                        <a
                          href={mapsLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
                        >
                          <Navigation
                            size={15}
                          />
                          View pinned location on Google Maps
                        </a>
                      ) : (
                        <p className="mt-3 text-xs text-gray-500">
                          No GPS pin was shared for
                          this order � use the
                          address above.
                        </p>
                      )}
                    </div>

                    {/* ORDER ACTIONS */}

                    <div className="flex flex-wrap gap-2 border-t bg-gray-50 p-4">

                      {!confirmed ? (
                        <button
                          type="button"
                          onClick={() =>
                            openConfirmation(
                              order
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                        >
                          <CheckCircle2
                            size={17}
                          />
                          Confirm Payment
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700">
                          <CheckCircle2
                            size={17}
                          />
                          Payment Confirmed
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openWhatsApp(
                            order
                          )
                        }
                        disabled={!phone}
                        className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-40"
                      >
                        <MessageCircle
                          size={17}
                        />
                        Message Customer
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEmail(order)
                        }
                        disabled={!email}
                        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                      >
                        <Mail size={17} />
                        Email
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          callCustomer(
                            order
                          )
                        }
                        disabled={!phone}
                        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                      >
                        <Phone size={17} />
                        Call
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          PRODUCT MODAL
      ===================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-xs text-gray-500">
                  Product information shown on
                  the public shop.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  isSaving ||
                  isUploadingImage
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* PRODUCT NAME */}

              <div>
                <label className="block text-sm font-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  required
                  value={
                    formData.name
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        name: event.target
                          .value,
                      })
                    )
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="e.g. Blood Pressure Monitor"
                />
              </div>

              {/* SHORT DESCRIPTION */}

              <div>
                <label className="block text-sm font-semibold">
                  Short Description
                </label>

                <input
                  type="text"
                  value={
                    formData.shortDescription
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        shortDescription:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Short marketing description"
                />
              </div>

              {/* FULL DESCRIPTION */}

              <div>
                <label className="block text-sm font-semibold">
                  Full Description
                </label>

                <textarea
                  required
                  rows={5}
                  value={
                    formData.description
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Full product description..."
                />
              </div>

              {/* PRICE / STOCK */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="block text-sm font-semibold">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={
                      formData.price
                    }
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,
                          price:
                            Number(
                              event.target
                                .value
                            ) || 0,
                        })
                      )
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={
                      formData.stock
                    }
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,
                          stock:
                            Number(
                              event.target
                                .value
                            ) || 0,
                        })
                      )
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* =================================================
                  PRODUCT IMAGES
              ================================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold">
                    Product Images
                  </label>

                  <span className="text-xs text-gray-500">
                    JPG, PNG, WEBP or GIF � Max 5MB
                  </span>
                </div>

                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm font-semibold transition ${
                    isUploadingImage
                      ? "cursor-not-allowed bg-gray-50 text-gray-400"
                      : "border-blue-300 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      Uploading image...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload Product Image
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={
                      isUploadingImage
                    }
                    onChange={
                      handleImageUpload
                    }
                  />
                </label>

                {/* IMAGE PREVIEWS */}

                {formData.imageUrls
                  .length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {formData.imageUrls.map(
                      (
                        imageUrl,
                        index
                      ) => (
                        <div
                          key={`${imageUrl}-${index}`}
                          className="group relative overflow-hidden rounded-xl border bg-gray-100"
                        >
                          <img
                            src={getImageUrl(imageUrl)}
                            alt={`Product image ${
                              index + 1
                            }`}
                            className="h-32 w-full object-cover"
                          />

                          {index ===
                            0 && (
                            <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                              Main Image
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 shadow transition group-hover:opacity-100"
                            title="Remove image"
                          >
                            <X
                              size={14}
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                {formData.imageUrls
                  .length === 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                    <ImagePlus
                      size={16}
                    />
                    No product image uploaded yet.
                  </div>
                )}
              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  checked={
                    formData.active
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        active:
                          event.target
                            .checked,
                      })
                    )
                  }
                  className="h-4 w-4"
                />

                <div>
                  <div className="font-semibold">
                    Product is active
                  </div>

                  <div className="text-xs text-gray-500">
                    Active products can appear
                    in the public shop.
                  </div>
                </div>
              </label>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    isSaving ||
                    isUploadingImage
                  }
                  className="rounded-lg border px-5 py-2.5 font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    isUploadingImage
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CONFIRM PAYMENT MODAL
      ===================================================== */}

      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  Confirm Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Order #
                  {selectedOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                disabled={
                  isConfirming
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="font-semibold">
                  {getCustomerName(
                    selectedOrder
                  )}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {selectedOrder.product
                    ?.name ||
                    "Product"}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Qty:{" "}
                  {getOrderQuantity(
                    selectedOrder
                  )}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {getOrderLocationText(
                    selectedOrder
                  )}
                </div>

                <div className="mt-2 text-sm">
                  Payment:{" "}
                  <strong>
                    {formatPaymentMethod(
                      selectedOrder.paymentMethod
                    )}
                  </strong>
                </div>

                <div className="mt-1 text-sm">
                  Payment ID:{" "}
                  <strong className="font-mono">
                    {selectedOrder.paymentId ||
                      "None"}
                  </strong>
                </div>

                {getOrderNote(
                  selectedOrder
                ) && (
                  <div className="mt-2 text-sm">
                    Customer Note:{" "}
                    <strong>
                      {getOrderNote(
                        selectedOrder
                      )}
                    </strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Admin Note
                </label>

                <textarea
                  rows={5}
                  value={
                    confirmationNote
                  }
                  onChange={(event) =>
                    setConfirmationNote(
                      event.target
                        .value
                    )
                  }
                  placeholder="Example: Payment received. Customer requested delivery after 4 PM."
                  className="mt-1 w-full rounded-lg border px-3 py-3 outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  The note will be saved with the
                  order and included in the WhatsApp
                  confirmation.
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <div className="flex gap-2">
                  <MessageCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <strong>
                      Customer notification
                    </strong>

                    <p className="mt-1">
                      After confirmation, WhatsApp
                      will open with a ready-to-send
                      payment confirmation message.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrder(
                      null
                    )
                  }
                  disabled={
                    isConfirming
                  }
                  className="rounded-lg border px-5 py-2.5 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    confirmPayment
                  }
                  disabled={
                    isConfirming
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isConfirming ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2
                      size={18}
                    />
                  )}

                  {isConfirming
                    ? "Confirming..."
                    : "Confirm & Notify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManager;
