import React, { useState } from 'react';
import '../App.css';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import Variant from './Variant';
import { DndContext, closestCorners } from '@dnd-kit/core';
import {
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import DragHandle from './DragHandle';

const Product = ({
  id,
  productNumber,
  title,
  variants,
  setProducts,
  handleDelete,
  setCurrentProductId,
  setShowProductPicker
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [discountDetails, setDiscountDetails] = useState({
    discount: 0,
    discountType: 'FLAT_OFF'
  });

  const handleDiscountDetailsChange = (e) => {
    const { name, value } = e.target;
    setDiscountDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddDiscount = () => setShowDiscountFields(true);

  const handleEditProduct = () => {
    setCurrentProductId(id);
    setShowProductPicker(true);
  };

  const handleShowVariants = () => setShowVariants((prevState) => !prevState);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = variants.findIndex(
      (variant) => variant.id === active.id
    );
    const overIndex = variants.findIndex((variant) => variant.id === over.id);

    const updatedVariants = arrayMove(variants, activeIndex, overIndex);
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, variants: updatedVariants } : product
      )
    );
  };

  const handleVariantDelete = (variantId) => {
    setProducts((prevState) =>
      prevState.map((product) =>
        product.id === id
          ? {
              ...product,
              variants: product.variants.filter(
                (variant) => variant.id !== variantId
              )
            }
          : product
      )
    );
  };

  return (
    <div ref={setNodeRef} {...attributes} style={style} className="product">
      <div className="flexWrapper">
        <DragHandle listeners={listeners} />
        <span>{productNumber}.</span>
        <div className="inputWithIcon">
          <input
            type="text"
            name="productPicker"
            className="productPickerInput field"
            readOnly
            placeholder="Select Product"
            value={title}
          />
          <button className="pencilIcon" onClick={handleEditProduct}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
        </div>
        {!showDiscountFields && (
          <button
            name="addDiscount"
            className="btn field"
            onClick={handleAddDiscount}
          >
            Add Discount
          </button>
        )}

        {showDiscountFields && (
          <>
            <input
              type="number"
              name="discount"
              className="discount field"
              value={discountDetails.discount}
              onChange={handleDiscountDetailsChange}
            />
            <select
              className="dicountType field"
              name="discountType"
              onChange={handleDiscountDetailsChange}
              value={discountDetails.discountType}
            >
              <option value="FLAT_OFF" className="option">
                Flat Off
              </option>
              <option value="PERCENTAGE" className="option">
                % Off
              </option>
            </select>
          </>
        )}
        <button
          name="deleteProduct"
          className="deleteProduct"
          onClick={() => handleDelete(id)}
        >
          X
        </button>
      </div>
      {variants.length > 1 && (
        <button
          name="showVariants"
          className="showVariants"
          onClick={handleShowVariants}
        >
          {showVariants ? 'Hide Variants' : 'Show Variants'}
        </button>
      )}

      {showVariants && (
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetector={closestCorners}
        >
          <SortableContext
            items={variants}
            strategy={verticalListSortingStrategy}
          >
            {variants.map((variant) => (
              <Variant
                key={variant.id}
                variantId={variant.id}
                title={variant.title}
                handleVariantDelete={handleVariantDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Product;
