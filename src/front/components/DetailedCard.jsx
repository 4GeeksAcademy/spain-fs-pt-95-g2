export const DetailedCard = ({ product }) => {
    if (!product) return <div className="card">There are not products</div>;

    return (
    <div className="card">
        <img src={product.image_url || "https://thumbs.dreamstime.com/z/retrato-del-hombre-mayor-feliz-con-el-pulgar-para-arriba-16276754.jpg"} className="card-img-top"></img>
        <div className="card-body">
            <h5>{product.name}</h5>
            <p>{product.category_id}</p>
            <p>Price: {product.price}</p>
            <p>Quantity: {product.quantity}</p>
        </div>
    </div>)
}

