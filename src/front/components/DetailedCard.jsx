export const DetailedCard = ({ product }) => {
    if (!product) return <div className="card">There are not products</div>;

    const cardImageStyle = {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderBottom: "1px solid #aed1d6"
    }

    return (
    <div className="card">
        <img src={product.image_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png"} className="card-img-top" style={cardImageStyle}></img>
        <div className="card-body">
            <h5>{product.name}</h5>
            <p>{product.category_id}</p>
            <p>Price: {product.price}</p>
        </div>
    </div>)
}

