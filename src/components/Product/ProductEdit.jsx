import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ProductEdit = ({ product, onSave }) => {
  const [form, setForm] = useState(product);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Product</h2>

      <Input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Product Name"
      />

      <Input
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: +e.target.value })}
        placeholder="Price"
      />

      <Input
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        placeholder="Category"
      />

      <Textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
      />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => onSave(form)}>Save Changes</Button>
      </div>
    </div>
  );
};

export default ProductEdit;
