import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine
from app.models import *  # noqa: registra todos los modelos en Base
from app.database import Base

from app.seeders.services_seeder import seed_services
from app.seeders.extras_seeder import seed_extras

Base.metadata.create_all(bind=engine)

def run():
    db = SessionLocal()
    try:
        print("Ejecutando seeders...")
        seed_services(db)
        seed_extras(db)
        print("Seeders completados.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
