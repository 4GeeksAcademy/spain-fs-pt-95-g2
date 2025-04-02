from flask import  request, jsonify, Blueprint
from api.models import db, Product , Inventory , Category
from flask_jwt_extended import jwt_required, get_jwt_identity 
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

##############
# PRODUCTS
##############

@api.route("/products", methods=["GET"])
# @jwt_required()
def get_products():
    products = db.session.query(Product).all()
    return jsonify([p.serialize() for p in products]), 200

@api.route("/products/<int:id>", methods=["GET"])
# @jwt_required()
def get_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200

@api.route("/products", methods=["POST"])
# @jwt_required()
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
# @jwt_required()
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
# @jwt_required()
def delete_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Producto eliminado"}), 200

##############
# INVENTORY
##############

@api.route("/inventories", methods=["GET"])
# @jwt_required()
def get_inventories():
    inventories = db.session.query(Inventory).all()
    return jsonify( [i.serialize() for i in inventories] ) , 200

@api.route("/inventories/<int:id>", methods=["GET"])
# @jwt_required()
def get_inventory(id):
    inventory = db.session.get( Inventory , id )
    if not inventory:
        return jsonify( {"error": "Inventario no encontrado"} ), 404
    return jsonify( inventory.serialize() ), 200

@api.route("/inventories", methods=["POST"])
# @jwt_required()
def create_inventory():
    data = request.get_json()
    user_id = get_jwt_identity()

    try:
        new_inventory = Inventory(
            name = data["name"],
            cif = data["cif"],
            location = data["location"],
            created_at = data.get("created_at"),
            sector = data["sector"],
            owner_id = user_id
        )
        db.session.add( new_inventory )
        db.session.commit()
        return jsonify( new_inventory.serialize() ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify( {"error": str(e)}), 400
    
@api.route("/inventories/<int:id>", methods=["PUT"])
# @jwt_required()
def update_inventory(id):
    inventory = db.session.get(Inventory , id)
    if not inventory:
        return jsonify( {"error": "Inventario no encontrado"}), 404

    data = request.get_json()
    try:
        inventory.name = data.get("name", inventory.name)
        inventory.cif = data.get("cif", inventory.cif)
        inventory.location = data.get("location", inventory.location)
        inventory.sector = data.get("sector", inventory.sector)
        db.session.commit()
        return jsonify(inventory.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify( {"error": str(e)} ), 400
    
@api.route("/inventories/<int:id>", methods=["DELETE"])
# @jwt_required()
def delete_inventory(id):
    inventory = db.session.get(Inventory, id)
    if not inventory:
        return jsonify( {"error": "Inventario no encontrado"} ), 404

    db.session.delete( inventory )
    db.session.commit()
    return jsonify( {"message": "Inventario eliminado"} ), 200

##############
# CATEGORY
##############

@api.route("/categories", methods=["GET"])
# @jwt_required()
def get_categories():
    categories = db.session.query(Category).all()
    return jsonify( [c.serialize() for c in categories] ), 200

@api.route("/categories/<int:id>", methods=["GET"])
# @jwt_required()
def get_category(id):
    category = db.session.get(Category, id)
    if not category:
        return jsonify( {"error": "Categoria no encontrada"} ), 404
    return jsonify( category.serialize() ), 200

@api.route("/categories", methods=["POST"])
# @jwt_required()
def create_category():
    data = request.get_json()
    try:
        new_category = Category(
            name = data["name"],
            descripcion = data["description"]
        )
        return jsonify(new_category.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify( {"error" : str(e)} ), 400