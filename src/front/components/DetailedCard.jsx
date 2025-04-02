export const DetailedCard = ({ Product }) => {
    <div className="card">
        <img src={Product.imageProduct} className="card-img-top"></img>
        <div className="card-body">
            <h5>{Product.name}</h5>
            <p>{Product.category}</p>
            <p>{Product.price}</p>
            <p>{Product.quantity}</p>
        </div>
    </div>
}