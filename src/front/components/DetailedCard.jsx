export const DetailedCard = ({ product }) => {
    <div className="card">
        <img src={roduct.image_url} className="card-img-top"></img>
        <div className="card-body">
            <h5>{product.name}</h5>
            <p>{product.category}</p>
            <p>{product.price}</p>
            <p>{product.quantity}</p>
        </div>
    </div>
}
