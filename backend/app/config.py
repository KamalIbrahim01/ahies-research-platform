import os
from dotenv import load_dotenv

load_dotenv()


class Config:

   SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://"
    f"{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT', '3306')}/"
    f"{os.getenv('DB_NAME')}"
    "?ssl_verify_cert=false"
)



SQLALCHEMY_TRACK_MODIFICATIONS = False