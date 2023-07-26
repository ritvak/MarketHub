import React, { useEffect, useState } from "react";
import "../PostApproval/postapproval.css";
import APIUtils from "../../helpers/APIUtils";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, );

  const api = (msg) => new APIUtils(msg);

  const getAllProducts = async () => {
    try {
      const response = await api().getAllProducts();
      if (Array.isArray(response.data.userData)) {
        setProducts(response.data.userData);
      } else {
        console.error("Invalid data format. Expected an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const rejectPost = async (productID) => {
    try {
      const response = await api(true).rejectPost(productID); 
      if (response.status === 200) {
        
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productID
              ? { ...product, isApproved: false }
              : product
          )
        );
        window.alert("Product rejected successfully!");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error rejecting product:", error);
    }
  };

  const approvePost = async (productID) => {
    try {
      const response = await api(true).approvePost(productID); 
      if (response.status === 200) {
        
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productID
              ? { ...product, isApproved: true }
              : product
          )
        );
        window.alert("Product approved successfully!");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error approving product:", error);
    }
  };

  return (
    <div>
     <h1 style={{ fontSize: "24px", textAlign: "center", color: "blue" }}>
        Product Approval
      </h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.productName} />
            <h2>{product.productName}</h2>
            <p>Price: {product.price}</p>
            <p>{product.productDescription}</p>

            <div>
              <button
                onClick={() => rejectPost(product._id)}
                disabled={!product.isApproved}
                style={{
                  backgroundColor: "#0000FF",
                  opacity: !product.isApproved ? "0.5" : "1.5", 
                }}
              >
                Reject
              </button>
              <span style={{ margin: "0 10px" }}></span>
              <button
                onClick={() => approvePost(product._id)}
                disabled={product.isApproved}
                style={{
                  backgroundColor: "#0000FF",
                  opacity: product.isApproved ? "0.5" : "1.5", 
                }}
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
