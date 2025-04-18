"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint, redirect
from api.models import db, User, UserInventory, Inventory
from api.utils import generate_sitemap, APIException, SerializerSingleton, send_email
from datetime import datetime, timedelta
from flask_cors import CORS
from typing import Optional
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_dance.contrib.google import make_google_blueprint, google
import requests
import bcrypt

api = Blueprint("api", __name__)
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


@api.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    user_inventory_links = UserInventory.query.filter_by(
        users_id=user_id).all()
    inventories = []

    for link in user_inventory_links:
        inventory = Inventory.query.get(link.inventories_id)
        if inventory:
            inventories.append({
                "name": inventory.name,
                "permissions": link.permissions
            })

    return jsonify({
        "username": user.username,
        "email": user.email,
        "created_date": user.created_date,
        "inventories": inventories
    }), 200


@api.route("/api/external/products", methods=["GET"])
def get_external_products():
    try:
        response = requests.get('https://dummyjson.com/products?limit=10')
        response.raise_for_status()

        data = response.json()
        products = [
            {
                "name": item["title"],
                "description": item["description"],
                "price": item["price"],
                "category": item["category"],
                "image": item["thumbnail"]
            }
            for item in data["products"]
        ]

        return jsonify(products), 200

    except Exception as e:
        return jsonify({
            "msg": "Error getting external products",
            "error": str(e)
        }), 500
