"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap, SerializerSingleton
from flask_cors import CORS
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_dance.contrib.google import make_google_blueprint, google

# from models import Person
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "super_secret")
print(app.config["JWT_SECRET_KEY"])
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
if not app.config["JWT_SECRET_KEY"]:
    raise ValueError("JWT_SECRET_KEY not configured")
jwt = JWTManager(app)

# Setup itsdangerous as serializaer
app.config["USTS_SECRET_KEY"] = os.getenv("USTS_SECRET", "other_super_secret") 
if not app.config["USTS_SECRET_KEY"]:
    raise ValueError("USTS_SECRET_KEY not configured")
serializer = SerializerSingleton.initialize(app.config["USTS_SECRET_KEY"])

# Allow OAuth over HTTP (Development only)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Configure the blueprint correctly
google_bp = make_google_blueprint(
    client_id = os.getenv("GOOGLE_CLIENT_ID"),
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_to='google_login_callback',
    scope=[
        "openid", 
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ]
)
app.register_blueprint(google_bp, url_prefix="/google_login")

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)
# add the admin
setup_commands(app)
# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0# avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
