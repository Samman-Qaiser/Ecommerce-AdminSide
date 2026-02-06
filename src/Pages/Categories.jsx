import React from "react";
import { EdDelCategory } from "../components/category/EdDelCategory";
import { useState } from "react";
import { CreateCategory } from "../components/category/CreateCategory";

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Saraee",
      slug: "suits",
      description: "Traditional Sindhi Ajrak designs",
      banner: "https://picsum.photos/300/200?random=1",
      featured: true,
    },
    {
      id: 2,
      name: "Suits",
      slug: "suits",
      description: "Premium silk sarees for weddings",
      banner: "https://picsum.photos/300/200?random=2",
      featured: false,
    },
 
  ]);

  return (
    <div className="space-y-7">
      <EdDelCategory categories={categories} />
      <CreateCategory />
    </div>
  );
};

export default Categories;
