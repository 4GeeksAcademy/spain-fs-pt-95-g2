import React, { useState, useEffect } from "react";
import { DetailedCard } from "./DetailedCard";
import { useProducts } from "../hooks/useProducts";

const ProductDetails = () => {
    const { products } = useProducts();

    return(
    <>
        <div className="container products">
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id_product} className="col-md-3">
                            <DetailedCard  product={product} />
                        </div>
                    ))
                ) : (
                    <p>Products are ampty</p>
                )
                }
            </div>
        </div>
    </>
    )
}

export default ProductDetails;