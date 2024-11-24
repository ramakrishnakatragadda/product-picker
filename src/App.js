import React, { useState } from 'react';
import ProductList from './components/ProductList';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const App = () => {
  const [products, setProducts] = useState([
    {
      id: 77,
      title: 'Fog Linen Chambray Towel - Beige Stripe',
      variants: [
        { id: 1, product_id: 77, title: 'XS / Silver', price: '49' },
        { id: 2, product_id: 77, title: 'S / Silver', price: '49' },
        { id: 3, product_id: 77, title: 'M / Silver', price: '49' }
      ],
      image: {
        id: 266,
        product_id: 77,
        src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1'
      }
    },
    {
      id: 80,
      title: 'Orbit Terrarium - Large',
      variants: [
        { id: 64, product_id: 80, title: 'Default Title', price: '109' }
      ],
      image: {
        id: 272,
        product_id: 80,
        src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1'
      }
    }
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProducts((prevProducts) => {
      const oldIndex = prevProducts.findIndex((p) => p.id === active.id);
      const newIndex = prevProducts.findIndex((p) => p.id === over.id);
      return arrayMove(prevProducts, oldIndex, newIndex);
    });
  };

  return (
    <div className="app">
      <DndContext onDragEnd={handleDragEnd} collisionDetector={closestCorners}>
        <ProductList products={products} setProducts={setProducts} />
      </DndContext>
    </div>
  );
};

export default App;
