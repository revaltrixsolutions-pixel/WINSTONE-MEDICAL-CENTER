
import React from "react";
import ShopManager from "../components/shop/ShopManager";

export const AdminShopPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Shop & Orders Management</h1>
      <ShopManager />
    </div>
  );
};
export default AdminShopPage;

