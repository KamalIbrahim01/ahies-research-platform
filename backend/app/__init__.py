from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from .config import Config


db = SQLAlchemy()


app = Flask(__name__)

CORS(app)

app.config.from_object(Config)

db.init_app(app)


@app.route("/")
def home():
    return "<h1>Welcome to the AHIES Research Platform</h1>"


from . import routes