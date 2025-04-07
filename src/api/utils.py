import os
from flask import jsonify, url_for
from itsdangerous import URLSafeTimedSerializer
import smtplib
from email.mime.text import MIMEText

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

class SerializerSingleton:

    _instance = None
    _secret_key = None

    def __new__(cls, secret_key = None):
        if cls._instance is None:
            if secret_key is None:
                raise ValueError("Secret key must be provided on first initialization")
            cls._instance = super().__new__(cls)
            cls._instance.serializer = URLSafeTimedSerializer(secret_key)
        return cls._instance

    @classmethod
    def initialize(cls, secret_key):
        if cls._instance is None:
            cls._instance = cls(secret_key)

    def dumps(self, email):
        return self.serializer.dumps(email, salt="password-reset")

    def loads(self, token):
        return self.serializer.loads(token, salt="password-reset", max_age=300)
    
def send_email(to, url):
    SMTP_SERVER = "in-v3.mailjet.com"
    SMTP_PORT = 587
    EMAIL_FROM = os.getenv("EMAIL_USER")
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    if not all([EMAIL_FROM, SMTP_USER, SMTP_PASSWORD]):
        print("Error: Email credentials not configured")
        return False

    message = f"""
        <p>¡Hi!</p>
        <p>You have requested to reset your password
        Click <a href="{url}">here</a> to continue</p>
        <p><i>If you didn't request this, please ignore this email</i></p>
        """

    msg = MIMEText(message, "html")
    msg["Subject"] = "Password reset"
    msg["From"] = EMAIL_FROM
    msg["To"] = to

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, [to], msg.as_string())
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False