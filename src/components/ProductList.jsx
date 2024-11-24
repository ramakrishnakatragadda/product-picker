import React, { useState } from 'react';
import Product from './Product';
import '../App.css';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { fetchedProductDetails } from './productUtils';
import ProductPicker from './ProductPicker';

const ProductList = ({ products, setProducts }) => {
  const [data] = useState(fetchedProductDetails());
  const [currentProductId, setCurrentProductId] = useState(null);
  const [showProductPicker, setShowProductPicker] = useState(false);

  // Since the api key is not available, hardcoding the product details
  // useEffect(() => {
  //   fetch('api')
  //     .then((res) => res.json())
  //     .then((data) => setData(data))
  //     .catch((err) => console.log(err));
  // });

  const handleAddProduct = () => {
    const newProduct = { id: uuidv4(), title: '', variants: [] };
    setProducts([...products, newProduct]);
  };

  const handleProductDelete = (id) => {
    setProducts((prevState) =>
      prevState.filter((product) => product.id !== id)
    );
  };

  return (
    <>
      <SortableContext items={products} strategy={verticalListSortingStrategy}>
        <div>
          {products.map(({ id, title, variants }, index) => (
            <Product
              key={id}
              id={id}
              productNumber={index + 1}
              title={title}
              variants={variants}
              setProducts={setProducts}
              handleDelete={handleProductDelete}
              setCurrentProductId={setCurrentProductId}
              data={data}
              setShowProductPicker={setShowProductPicker}
            />
          ))}
          <button
            name="addProduct"
            className="addProduct"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>
      </SortableContext>

      {showProductPicker && (
        <ProductPicker
          data={data}
          setShowProductPicker={setShowProductPicker}
          products={products}
          setProducts={setProducts}
          currentProductId={currentProductId}
        />
      )}
    </>
  );
};

export default ProductList;
