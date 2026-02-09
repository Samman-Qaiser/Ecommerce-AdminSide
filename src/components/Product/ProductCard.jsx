import { motion } from "framer-motion";
import { Pencil, Trash2, MoreVertical } from "lucide-react";

import {useState} from 'react'
const AdminProductCard = ({ product, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const handleDelete = () => {
  setProducts(prev =>
    prev.filter(p => p.id !== deleteTarget.id)
  );
  setDeleteTarget(null);
  setOpen(false);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
    >
      {/* Top Action Bar (Floating) */}
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={onEdit}
          className="p-2 bg-white/90 backdrop-blur-md text-slate-700 rounded-full shadow-sm hover:bg-black hover:text-white transition-colors"
          title="Edit Product"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-white/90 backdrop-blur-md text-red-600 rounded-full shadow-sm hover:bg-red-600 hover:text-white transition-colors"
          title="Delete Product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-4/5 bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
        {/* Subtle Gradient Overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="text-base font-medium text-slate-900 truncate mb-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-semibold text-slate-900">
            ₹{product.price.toLocaleString()}
          </p>
          
          {/* Status Indicator (Example: Stock level) */}
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-slate-500 uppercase">In Stock</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProductCard;