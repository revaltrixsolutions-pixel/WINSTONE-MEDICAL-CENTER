import React, { useEffect, useState } from "react";
import { shopApi } from "../../../api/shop";
import type { Product } from "../../../api/shop";
import ProductPopup from "../components/shop/ProductPopup";


export const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  useEffect(() => {
    shopApi.getProducts()
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold text-lg">Loading shop...</p>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Our Shop</h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">Browse our premium products and order with fast, reliable delivery.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map(product => (
            <div 
              key={product.id} 
              className="group bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {product.imageUrls[0] && (
                <div className="relative overflow-hidden">
                  <img 
                    src={product.imageUrls[0]} 
                    alt={product.name} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-slate-800 line-clamp-1">{product.name}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                  {product.shortDescription || product.description.substring(0, 100) + "..."}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    KSh ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-slate-600 text-lg font-medium">No products available yet.</p>
            <p className="text-slate-500 text-sm mt-2">Check back soon!</p>
          </div>
        )}

        {selectedProduct && (
          <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </div>
  );
};


export default ShopPage;