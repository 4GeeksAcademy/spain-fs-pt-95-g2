"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserInventory
from api.utils import generate_sitemap, APIException
from datetime import datetime, timedelta
from flask_cors import CORS
from typing import Optional
from sqlalchemy import select
from flask_jwt_extended import create_access_token
import bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

def hash_password(password):
    password = password.encode('utf-8')
    password = bcrypt.hashpw(password, bcrypt.gensalt())
    password = password.decode('utf-8')
    return password

@api.route("/signup", methods=["POST"])
def handle_signup():
    response_body = {}
    if not request.method == "POST":
        response_body["message"] = "Method not allowed."
        return response_body, 400
    
    data = request.get_json(silent=True)
    if not data:
        response_body["error"] = "Invalid or empty JSON"
        return response_body, 400

    required_data = ["username", "email", "password"]
    for field in required_data:
        if field not in data:
            response_body["error"] = {f"The {field} is missing: "}
            return response_body, 400
    user = db.session.scalars(db.select(User).filter(User.email.ilike(data["email"]))).first()
    if user:
        response_body["message"] = "This user already exists"
        return response_body, 400
    user = User(
        username = data["username"],
        email = data["email"].lower(),
        password = hash_password(data["password"]),
        is_active = True,
        expired_date = datetime.now() + timedelta(days=365)
    )

    db.session.add(user)
    db.session.commit()
    response_body["message"] = "User created successfully!"
    return response_body, 200

    

@api.route("/login", methods=["POST"])
def handle_login():
    response_body = {}
    if not request.method == 'POST':
        response_body["message"] = "Method not allowed."
        return response_body, 400
    
    data = request.get_json(silent=True)
    if not data:
        response_body["error"] = "Invalid or empty JSON"
        return response_body, 400

    required_data = ["email", "password"]
    for field in required_data:
        if field not in data:
            response_body["error"] = {f"The {field} is missing: "}
            return response_body, 400
        
    user = db.session.scalars(db.select(User).filter(User.email.ilike(data["email"]))).first()
    if not user or not bcrypt.checkpw(data["password"].encode('utf-8'), user.password.encode('utf-8')):
        response_body["error"] = "Invalid email or password"
        return response_body, 400
    if not user.is_active:
        response_body["error"] = "User account is inactive"
        return response_body, 400
    if user.expired_date and user.expired_date < datetime.now():
        response_body["error"] = "User account has expired"
        return response_body, 400
    
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
def handlle_users():
    response_body = {}
    if not request.method == "GET":
        response_body["message"] = "Method not allowed."
        return response_body, 400
    
    permissions_filter = request.args.get('permissions')
    query = db.select(User)

    if permissions_filter:
        query = (
            query.join(UserInventory, User.id == UserInventory.users_id)
            .where(UserInventory.permissions == permissions_filter)
        )

    users = db.session.execute(query).scalars().all()
    response_body = {
        "success": True,
        "users": [user.serialize() for user in users]
    }
    return response_body, 200

@api.route("/users/id/<int:id_user>", methods=["GET"])
def handle_users_by_id(id_user):
    response_body = {}
    if not request.method == "GET":
        response_body["message"] = "Method not allowed."
        return response_body, 400
    
    user = db.session.execute(db.select(User).where(User.id == id_user)).scalar()
    if not user:
        response_body["message"] = {f"{id_user} not found."}
        return response_body, 200
    
    response_body["result"] = user.serialize()
    response_body["message"] = {f"{id_user} user"}
    return response_body, 200
