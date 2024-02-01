import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // import your Axios instance
import { Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {Link} from 'react-router-dom'


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
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            <IconButton color="secondary" component={Link} to={`edit/${product.original.id}`}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" component={Link} to={`delete/${product.original.id}`}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </div>
      ))}
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
      <button onClick={handleNextPage}>Next Page</button>
    </div>
  );
};

export default ProductCatalog;