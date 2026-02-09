import React, { useState } from "react";
import ProductEdit from "../components/Product/ProductEdit";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AdminProductCard from "../components/Product/ProductCard";

const dummyProducts = [
    {
        id: 1,
        name: "Leather Jacket",
        price: 8999,
        category: "Men",
        image: "https://picsum.photos/400/600?1",
        description: "Premium leather jacket",
    },
    {
        id: 2,
        name: "Summer Dress",
        price: 4999,
        category: "Women",
        image: "https://picsum.photos/400/600?2",
        description: "Lightweight summer dress",
    },
];

const AllProduct = () => {
    const [products, setProducts] = useState(dummyProducts);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleUpdate = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((item) => (
                    <AdminProductCard
                        key={item.id}
                        product={item}
                        isAdmin
                        onEdit={() => handleEdit(item)}
                    />
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl">
                    {selectedProduct && (
                        <ProductEdit
                            product={selectedProduct}
                            onSave={handleUpdate}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AllProduct;
