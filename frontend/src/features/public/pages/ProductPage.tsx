import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Package, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { shopApi, type Product } from "@/api/shop";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const products = await shopApi.getProducts();
        const found = products.find((item) => item.id === id);

        if (!found) {
          setError("Product not found.");
          return;
        }

        setProduct(found);
      } catch (err: any) {
        console.error("Failed to load product:", err);

        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    } else {
      setError("Invalid product link.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Package className="w-14 h-14 mx-auto mb-4 text-gray-400" />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h1>

          <p className="text-gray-500 mb-6">
            {error || "This product is no longer available."}
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const image =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-100 min-h-[400px] flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full max-h-[600px] object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Package className="w-20 h-20 mx-auto mb-3" />
                  <p>No product image</p>
                </div>
              )}
            </div>

            <div className="p-8 md:p-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
                Winston Medical Centre
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-lg text-gray-600 mb-6">
                  {product.shortDescription}
                </p>
              )}

              <div className="text-3xl font-bold text-blue-600 mb-6">
                KES {Number(product.price).toLocaleString()}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>

                <p className="text-gray-600 leading-7 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-gray-500" />

                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    {product.stock} available
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Out of stock
                  </span>
                )}
              </div>

              {product.stock > 0 ? (
                <Link
                  to={/shop?product=}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy This Product
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full px-6 py-4 rounded-xl bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              <p className="text-sm text-gray-500 text-center mt-4">
                Contact Winston Medical Centre for assistance with your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
