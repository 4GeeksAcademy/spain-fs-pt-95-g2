"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserInventory, Inventory , Product, Category, Supplier
from api.utils import generate_sitemap, APIException, SerializerSingleton, send_email
from datetime import datetime, timedelta
from flask_cors import CORS
from typing import Optional
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import requests
import bcrypt

api = Blueprint('api', __name__)
CORS(api)

def hash_password(password):
    password = password.encode("utf-8")
    password = bcrypt.hashpw(password, bcrypt.gensalt())
    password = password.decode("utf-8")
    return password
  

@api.route("/signup", methods=["POST"])
def handle_signup():
    response_body = {}
    if not request.method == "POST":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    data = request.get_json(silent=True)
    if not data:
        response_body["error"] = "Invalid or empty JSON"
        return response_body, 400

    required_data = ["username", "email", "password"]
    for field in required_data:
        if field not in data:
            response_body["error"] = {f"The {field} is missing: "}
            return response_body, 400
    user = db.session.scalars(db.select(User).filter(
        User.email.ilike(data["email"]))).first()
    if user:
        response_body["message"] = "This user already exists"
        return response_body, 409
    user = User(
        username=data["username"],
        email=data["email"].lower(),
        password=hash_password(data["password"]),
        is_active=True,
        expired_date=datetime.now() + timedelta(days=365),
        staff_number=0
    )

    db.session.add(user)
    db.session.commit()
    response_body["message"] = "User created successfully!"
    return response_body, 201
  
  
@api.route("/login", methods=["POST"])
def handle_login():
    response_body = {}
    if not request.method == "POST":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    data = request.get_json(silent=True)
    if not data:
        response_body["error"] = "Invalid or empty JSON"
        return response_body, 400

    required_data = ["email", "password"]
    for field in required_data:
        if field not in data:
            response_body["error"] = {f"The {field} is missing: "}
            return response_body, 400

    user = db.session.scalars(db.select(User).filter(
        User.email.ilike(data["email"]))).first()
    if not user or not bcrypt.checkpw(data["password"].encode('utf-8'), user.password.encode("utf-8")):
        response_body["error"] = "Invalid email or password"
        return response_body, 401
    if not user.is_active:
        response_body["error"] = "User account is inactive"
        return response_body, 403
    if user.expired_date and user.expired_date < datetime.now():
        response_body["error"] = "User account has expired"
        return response_body, 403

    access_token = create_access_token(identity=user.id)
    response_body = {
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    }
    return response_body, 200


@api.route("/users", methods=["GET"])
def handle_users():
    response_body = {}
    if not request.method == "GET":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    users = User.query.all()
    response_body = {
        "success": True,
        "users": [user.serialize() for user in users]
    }
    return response_body, 200


@api.route("/users/id/<int:id_user>", methods=["GET"])
def handle_users_by_id(id_user):
    response_body = {}
    if not request.method == "GET":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    user = db.session.execute(
        db.select(User).where(User.id == id_user)).scalar()
    if not user:
        response_body["error"] = {f"{id_user} not found."}
        return response_body, 404

    response_body["result"] = user.serialize()
    response_body["message"] = {f"{id_user} user"}
    return response_body, 200


@api.route("/forgot-password", methods=["POST"])
def handle_forgot_password():
    response_body = {}
    if not request.method == "POST":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    data = request.get_json(silent=True)
    if not data:
        response_body["error"] = "Invalid or empty JSON"
        return response_body, 400

    email = data["email"].strip().lower()
    user = db.session.scalars(db.select(User).filter(
        User.email.ilike(data["email"]))).first()
    if not user:
        response_body["message"] = "If the email exists, you should have received the recovery message."
        return response_body, 200

    token = SerializerSingleton().dumps(email)
    reset_url = url_for("api.handle_reset_password",
                        token=token, _external=True)
    send_email(
        to=user.email,
        url=reset_url
    )
    response_body["message"] = "Recovery email sent"
    return response_body, 200


@api.route("/reset-password/<token>", methods=["POST"])
def handle_reset_password(token):
    response_body = {}
    if not request.method == "POST":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    data = SerializerSingleton.loads(token)
    if not data:
        response_body["error"] = "Invalid or expired token"
        return response_body, 401

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        response_body["error"] = "User not found"
        return response_body, 404

    new_password = request.json.get("new_password")
    if not new_password:
        response_body["error"] = "Invalid new password"
        return response_body, 400
    user.password = hash_password(new_password)

    db.session.add(user)
    db.session.commit()
    response_body["message"] = "Password reset succesfully"
    return response_body, 200
  
##############
# PRODUCTS
##############

@api.route("/products", methods=["GET"])
@jwt_required()
def get_products():
    products = db.session.query(Product).all()
    return jsonify([p.serialize() for p in products]), 200

@api.route("/products/<int:id>", methods=["GET"])
@jwt_required()
def get_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200

@api.route("/products", methods=["POST"])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def get_inventories():
    inventories = db.session.query(Inventory).all()
    return jsonify( [i.serialize() for i in inventories] ) , 200

@api.route("/inventories/<int:id>", methods=["GET"])
@jwt_required()
def get_inventory(id):
    inventory = db.session.get( Inventory , id )
    if not inventory:
        return jsonify( {"error": "Inventario no encontrado"} ), 404
    return jsonify( inventory.serialize() ), 200

@api.route("/inventories", methods=["POST"])
@jwt_required()
def create_inventory():
    data = request.get_json()
    
@api.route("/inventories/<int:id>", methods=["PUT"])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def get_categories():
    categories = db.session.query(Category).all()
    return jsonify( [c.serialize() for c in categories] ), 200

@api.route("/categories/<int:id>", methods=["GET"])
@jwt_required()
def get_category(id):
    category = db.session.get(Category, id)
    if not category:
        return jsonify( {"error": "Categoria no encontrada"} ), 404
    return jsonify( category.serialize() ), 200

@api.route("/categories", methods=["POST"])
@jwt_required()
def create_category():
    data = request.get_json()
    try:
        new_category = Category(
            name = data["name"],
            description = data["description"]
        )
        return jsonify(new_category.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify( {"error" : str(e)} ), 400

##############
# SUPPLIERS
##############

@api.route("/suppliers", methods= ["GET"])
@jwt_required()
def get_suppliers():
    suppliers = db.session.query(Supplier).all()
    return jsonify( [s.serialize() for s in suppliers]), 200

@api.route("/suppliers", methods=  ["POST"])
#@jwt_required()
def add_supplier():
    data = request.get_json()
    try:
        new_supplier = Supplier(
            name = data["name"],
            contact_name = data["contact_name"],
            email = data["email"],
            phone = data["phone"],
            address = data["address"]
        )
        db.session.add(new_supplier)
        db.session.commit()
        return jsonify(new_supplier.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error" : str(e)}), 400



