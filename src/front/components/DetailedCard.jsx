export const DetailedCard = ({ imageProduct, name, price, quantity, category }) => {
    <div className="card">
        <img src={imageProduct} className="card-img-top"></img>
        <div className="card-body">
            <h5>{name}</h5>
            <p>{category}</p>
            <p>{price}</p>
            <p>{quantity}</p>
        </div>
    </div>
}