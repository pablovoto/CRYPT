import React, { useState, useEffect } from 'react';
import AxiosInstance from './AxiosInstance'; // import your Axios instance

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Change this to your desired number of products per page

  const getProducts = () => {
    AxiosInstance.get(`products/?page=${currentPage}&limit=${productsPerPage}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  const handleAddProduct = (product) => {
    // Add product to your database
  };

  const handleEditProduct = (productId, updatedProduct) => {
    // Edit product in your database
  };

  const handleDeleteProduct = (productId) => {
    // Delete product from your database
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Catalog</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <button onClick={() => handleEditProduct(product.id)}>Edit</button>
          <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleAddProduct}>Add Product</button>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
      <button onClick={handleNextPage}>Next Page</button>
    </div>
  );
};

export default ProductCatalog;