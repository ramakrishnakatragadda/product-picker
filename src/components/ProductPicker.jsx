import React, { useState } from 'react';
import '../App.css';
const ProductPicker = ({
  data,
  setShowProductPicker,
  setProducts,
  currentProductId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedProducts, setCheckedProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(data);

  const handleClose = () => {
    setShowProductPicker(false);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredProducts(data);
    } else {
      const filtered = data.filter(({ title, variants }) => {
        const matchesProduct = title.toLowerCase().includes(term.toLowerCase());
        const matchesVariant = variants.some(({ title }) =>
          title.toLowerCase().includes(term.toLowerCase())
        );
        return matchesProduct || matchesVariant;
      });

      setFilteredProducts(filtered);
    }
  };

  const handleProductChange = (productId) => {
    setCheckedProducts((prev) => {
      const product = data.find((product) => product.id === productId);
      if (!product) return prev;

      const currentProductState = prev[productId] || {};
      const allChecked = product.variants.every(
        (variant) => currentProductState[variant.id]
      );

      const updatedProductState = {};
      product.variants.forEach(({ id }) => {
        updatedProductState[id] = !allChecked;
      });

      return { ...prev, [productId]: updatedProductState };
    });
  };

  const handleVariantChange = (productId, variantId) => {
    setCheckedProducts((prev) => {
      const product = prev[productId] || {};
      const updatedProduct = {
        ...product,
        [variantId]: !product[variantId]
      };

      return { ...prev, [productId]: updatedProduct };
    });
  };

  const handleAddProduct = () => {
    const selectedProducts = Object.entries(checkedProducts)
      .filter(([, variants]) => Object.values(variants).some(Boolean))
      .map(([productId, variants]) => {
        const productDetails = data.find(
          (product) => product.id === parseInt(productId)
        );

        const selectedVariants = Object.entries(variants)
          .filter(([, isChecked]) => isChecked)
          .map(([variantId]) =>
            productDetails.variants.find(
              (variant) => variant.id === parseInt(variantId)
            )
          );

        return {
          ...productDetails,
          variants: selectedVariants
        };
      });

    setProducts((prevProducts) => {
      if (currentProductId) {
        const existingProductIndex = prevProducts.findIndex(
          (product) => product.id === currentProductId
        );

        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = {
          ...prevProducts[existingProductIndex],
          ...selectedProducts[0],
          variants: selectedProducts[0]?.variants || []
        };

        const newProducts = selectedProducts
          .slice(1)
          .filter(
            (selectedProduct) =>
              !prevProducts.some((product) => product.id === selectedProduct.id)
          );

        return [...updatedProducts, ...newProducts];
      } else {
        const newProducts = selectedProducts.filter(
          (selectedProduct) =>
            !prevProducts.some((product) => product.id === selectedProduct.id)
        );
        return [...prevProducts, ...newProducts];
      }
    });

    setShowProductPicker(false);
  };

  return (
    <div className="productPicker">
      <div className="modal">
        <div className="modalHeader">
          <h3 className="modalTitle">Add Products</h3>
          <button onClick={handleClose} className="close">
            X
          </button>
        </div>
        <input
          type="text"
          className="searchBar"
          name="seachBar"
          value={searchTerm}
          placeholder="Search for products"
          onChange={handleSearch}
        />
        <div className="modalContent">
          {filteredProducts.map(({ id, title, variants, image }) => {
            const productChecked = checkedProducts[id]
              ? Object.values(checkedProducts[id]).every(Boolean)
              : false;
            return (
              <div className="productsListWrapper" key={id}>
                <li className="productListItem">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={productChecked}
                    name="product"
                    onChange={() => handleProductChange(id)}
                  />
                  <img
                    src={image.src}
                    width={30}
                    height="100%"
                    alt=""
                    className="image"
                  />
                  <label htmlFor="product">{title}</label>
                  {variants.length === 1 && <span>{variants[0].price}$</span>}
                </li>
                {variants.length > 1 &&
                  variants.map((variant) => {
                    const variantChecked =
                      checkedProducts[id]?.[variant.id] || false;
                    return (
                      <li className="variantListItem" key={variant.id}>
                        <input
                          type="checkbox"
                          name="variant"
                          className="checkbox"
                          checked={variantChecked}
                          onChange={() => handleVariantChange(id, variant.id)}
                        />
                        <label htmlFor="variant">{variant.title}</label>
                        <span>{variant.price}$</span>
                      </li>
                    );
                  })}
              </div>
            );
          })}
        </div>
        <div className="modalFooter">
          <p>
            {
              Object.values(checkedProducts)
                .flatMap((variants) => Object.values(variants))
                .filter(Boolean).length
            }{' '}
            products selected
          </p>
          <button
            name="cancel"
            onClick={() => setShowProductPicker(false)}
            className="btn"
          >
            Cancel
          </button>
          <button name="add" onClick={handleAddProduct} className="btn">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
