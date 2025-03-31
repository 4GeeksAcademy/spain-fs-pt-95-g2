from flask import  request, jsonify, Blueprint
from api.models import db, Product 
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

@api.route("/products", methods=["GET"])
def get_products():
    products = db.session.query(Product).all()
    return jsonify([p.serialize() for p in products]), 200

@api.route("/products/<int:id>", methods=["GET"])
def get_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200

@api.route("/products", methods=["POST"])
def create_product():
    data = request.get_json()
    try:
        new_product = Product(
            name = data["name"],
            price = data["price"],
            quantity = data["quantity"],
            category_id=data["category_id"],
            inventories_id=data["inventories_id"]
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error" : str(e)}), 400

@api.route("/products/<int:id>", methods=["PUT"])
def update_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    data = request.get_json()
    try:
        product.name = data.get("name", product.name)
        product.price = data.get("price", product.price)
        product.quantity = data.get("quantity", product.quantity)
        product.category_id = data.get("category_id", product.category_id)
        product.inventories_id = data.get("inventories_id", product.inventories_id)

        db.session.commit()
        return jsonify(product.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
@api.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Producto eliminado"}), 200


