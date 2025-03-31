from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from api.models import db, User, UserInventory, Inventory
import requests

api = Blueprint("api", __name__)
CORS(api)

@api.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    user_inventory_links = UserInventory.query.filter_by(users_id=user_id).all()
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
