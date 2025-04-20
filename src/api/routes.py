"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint, redirect
from api.models import db, User, UserInventory, Inventory , Product, Category, Transaction
from api.utils import generate_sitemap, APIException, SerializerSingleton, send_email
from datetime import datetime, timedelta
from flask_cors import CORS
from typing import Optional
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_dance.contrib.google import make_google_blueprint, google
import requests
import bcrypt

api = Blueprint('api', __name__)
CORS(api)

PWD_ENCODE_FMT = "utf-8"
FRONTEND_URL = os.getenv("VITE_FRONTEND_URL")

def hash_password(password: str) -> str:
    encoded_password = password.encode(PWD_ENCODE_FMT)
    hashed_password = bcrypt.hashpw(encoded_password, bcrypt.gensalt())
    return hashed_password.decode(PWD_ENCODE_FMT)

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
    if not user or not bcrypt.checkpw(data["password"].encode(PWD_ENCODE_FMT), user.password.encode(PWD_ENCODE_FMT)):
        response_body["error"] = "Invalid email or password"
        return response_body, 401
    if not user.is_active:
        response_body["error"] = "User account is inactive"
        return response_body, 403
    if user.expired_date and user.expired_date < datetime.now():
        response_body["error"] = "User account has expired"
        return response_body, 403
    if data.get("remember_me"):
        expires = timedelta(days=31)
    else:
        expires = timedelta(hours=1)

    access_token = create_access_token(
        identity=str(user.id_user), expires_delta=expires)
    response_body = {
        "message": "Login successful",
        "access_token": access_token,
        "expires_in": expires.total_seconds(),
        "user_id": user.id_user,
        "username": user.username,
        "email": user.email
    }
    return response_body, 200


@api.route('/login_google')
def login_google():
    return redirect(url_for('google.login'))


@api.route('/google_login/callback')
def google_login_callback():
    if 'usuario' in session:
        return redirect(url_for('pagina_principal'))

    if not google.authorized:
        return redirect(url_for('google.login'))

    resp = google.get('https://www.googleapis.com/oauth2/v3/userinfo')

    if not resp.ok:
        flash("Error al obtener información de Google. Intenta nuevamente.", "error")
        return redirect(url_for('login'))

    user_info = resp.json()

    # 🔍 Imprimir la respuesta para depuración
    print("Respuesta de Google:", user_info)

    # Verificar que Google haya enviado un email
    if 'email' not in user_info:
        flash("Error: Google no proporcionó un email.", "error")
        return redirect(url_for('login'))

    # Obtener el ID único de Google
    google_id = user_info.get("sub")

    # Verificar si el usuario ya está registrado
    user = collection.find_one({'email': user_info['email']})
    if not user:
        # Registrar nuevo usuario con Google
        collection.insert_one({
            'usuario': user_info.get('name', 'Usuario sin nombre'),
            'email': user_info['email'],
            'google_id': google_id  # Guardamos el ID único de Google
        })

    # Iniciar sesión guardando el nombre en la sesión
    session['usuario'] = user_info.get('name', 'Usuario sin nombre')

    return redirect(url_for('pagina_principal'))


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
        db.select(User).where(User.id_user == id_user)).scalar()
    if not user:
        response_body["error"] = f"{id_user} not found."
        return response_body, 404

    response_body["result"] = user.serialize()
    response_body["message"] = f"{id_user} user"
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
        User.email.ilike(email))).first()
    if not user:
        response_body["message"] = "If the email exists, you should have received the recovery message."
        return response_body, 200

    username = user.username if user.username else "User"
    token = SerializerSingleton().dumps(email)
    reset_url = f"{FRONTEND_URL}reset-password?token={token}"
    send_email(
        to=user.email,
        url=reset_url,
        name=username
    )
    response_body["message"] = "Recovery email sent"
    return response_body, 200


@api.route("/reset-password/", methods=["POST"])
def handle_reset_password():
    response_body = {}
    if not request.method == "POST":
        response_body["error"] = "Method not allowed."
        return response_body, 405

    token = request.args.get("token")
    if not token:
        response_body["error"] = "Missing token"
        return response_body, 400

    data = SerializerSingleton().loads(token)
    if not data:
        response_body["error"] = "Invalid or expired token"
        return response_body, 401

    user = User.query.filter_by(email=data).first()
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
            name=data["name"],
            price=data["price"],
            category_id=data["category_id"],
            inventories_id=data["inventories_id"]
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


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
        product.category_id = data.get("category_id", product.category_id)
        product.inventories_id = data.get(
            "inventories_id", product.inventories_id)

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
    return jsonify([i.serialize() for i in inventories]), 200



@api.route("/inventories/<int:id>", methods=["GET"])
@jwt_required()
def get_inventory(id):
    inventory = db.session.get(Inventory, id)
    if not inventory:
        return jsonify({"error": "Inventario no encontrado"}), 404
    return jsonify(inventory.serialize()), 200


@api.route("/inventories", methods=["POST"])
@jwt_required()
def create_inventory():
    data = request.get_json()
    user_id = get_jwt_identity()

    try:
        new_inventory = Inventory(
            name=data["name"],
            cif=data["cif"],
            location=data["location"],
            created_at=data.get("created_at"),
            sector=data["sector"],
            owner_id=user_id
        )
        db.session.add(new_inventory)
        db.session.commit()
        return jsonify(new_inventory.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@api.route("/inventories/<int:id>", methods=["PUT"])
@jwt_required()
def update_inventory(id):
    inventory = db.session.get(Inventory, id)
    if not inventory:
        return jsonify({"error": "Inventario no encontrado"}), 404

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
        return jsonify({"error": str(e)}), 400


@api.route("/inventories/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_inventory(id):
    inventory = db.session.get(Inventory, id)
    if not inventory:
        return jsonify({"error": "Inventario no encontrado"}), 404

    db.session.delete(inventory)
    db.session.commit()
    return jsonify({"message": "Inventario eliminado"}), 200

##############
# CATEGORY
##############


@api.route("/categories", methods=["GET"])
@jwt_required()
def get_categories():
    categories = db.session.query(Category).all()
    return jsonify([c.serialize() for c in categories]), 200


@api.route("/categories/<int:id>", methods=["GET"])
@jwt_required()
def get_category(id):
    category = db.session.get(Category, id)
    if not category:
        return jsonify({"error": "Categoria no encontrada"}), 404
    return jsonify(category.serialize()), 200


@api.route("/categories", methods=["POST"])
@jwt_required()
def create_category():
    data = request.get_json()
    try:
        new_category = Category(
            name=data["name"],
            description=data["description"]
        )
        db.session.add(new_category)
        db.session.commit()
        return jsonify(new_category.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@api.route("/categories/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    category = db.session.get(Category, id)
    if not category:
        return jsonify({"error": "Categoria no encontrada"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Categoria eliminada"}), 200


##############
# TRANSACTION
##############

@api.route("/transactions", methods=["GET"])
@jwt_required()
def get_all_transactions():
    transactions = Transaction.query.all()
    return jsonify([t.serialize() for t in transactions]), 200


@api.route("/transaction/<int:id_transaction>", methods=["GET"])
@jwt_required()
def get_transaction_by_id(id_transaction):
    transaction = Transaction.query.get(id_transaction)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404
    return jsonify(transaction.serialize()), 200


@api.route("/transaction", methods=["POST"])
@jwt_required()
def create_transaction():
    data = request.get_json()

    required_fields = ["product_id", "inventories_id",
                       "quantity", "transaction_type"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        new_transaction = Transaction(
            product_id=data["product_id"],
            inventories_id=data["inventories_id"],
            quantity=data["quantity"],
            transaction_type=data["transaction_type"],
            created_at=datetime.utcnow()
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify(new_transaction.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@api.route("/transaction/<int:id_transaction>", methods=["PUT"])
@jwt_required()
def update_transaction(id_transaction):
    transaction = Transaction.query.get(id_transaction)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    data = request.get_json()

    try:
        transaction.product_id = data.get("product_id", transaction.product_id)
        transaction.inventories_id = data.get(
            "inventories_id", transaction.inventories_id)
        transaction.quantity = data.get("quantity", transaction.quantity)
        transaction.transaction_type = data.get(
            "transaction_type", transaction.transaction_type)
        db.session.commit()
        return jsonify(transaction.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@api.route("/transaction/<int:id_transaction>", methods=["DELETE"])
@jwt_required()
def delete_transaction(id_transaction):
    transaction = Transaction.query.get(id_transaction)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    try:
        db.session.delete(transaction)
        db.session.commit()
        return jsonify({"message": "Transaction deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


##############
# STOCK
##############

@api.route("/products/stock", methods=["GET"])
@jwt_required()
def get_products_with_stock():
    try:
        products = Product.query.all()
        result = []

        for product in products:
            entradas = sum(
                t.quantity for t in product.transactions if t.transaction_type == "entrada"
            )
            salidas = sum(
                t.quantity for t in product.transactions if t.transaction_type == "salida"
            )
            stock = entradas - salidas

            result.append({
                "id_product": product.id_product,
                "name": product.name,
                "price": float(product.price),
                "stock": stock,
                "category_id": product.category_id,
                "inventories_id": product.inventories_id,
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
