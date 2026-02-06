import React from 'react'
import {EdDelCategory} from '../components/category/EdDelCategory'
import {CreateCategory} from '../components/category/CreateCategory'
import { useState } from 'react'
import CreateSubCategory from '../components/category/CreateSubCategory'

const Categories = () => {
const [categories, setCategories] = useState([
  {
    id: 1,
    name: "Ajrak Collection",
    slug: "ajrak-collection",
    description: "Traditional Sindhi Ajrak designs",
    banner: "https://picsum.photos/300/200?random=1",
    featured: true,
  },
  {
    id: 2,
    name: "Silk Sarees",
    slug: "silk-sarees",
    description: "Premium silk sarees for weddings",
    banner: "https://picsum.photos/300/200?random=2",
    featured: false,
  },
  {
    id: 3,
    name: "Cotton Prints",
    slug: "cotton-prints",
    description: "Daily wear cotton sarees",
    banner: "https://picsum.photos/300/200?random=3",
    featured: false,
  },
  {
    id: 4,
    name: "Handloom Special",
    slug: "handloom-special",
    description: "Authentic handloom saree collection",
    banner: "https://picsum.photos/300/200?random=4",
    featured: true,
  },
]);

  return (
    <div className='space-y-7'>
    <EdDelCategory categories={categories}
 />
  <CreateSubCategory />
    </div>
  )
}

export default Categories