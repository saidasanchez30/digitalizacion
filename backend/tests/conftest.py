import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, get_db
from app.models.service_model import Service
from app.models.extra_model import Extra
from app.models.quotation_model import Quotation, QuotationExtra
from app.models.order_model import Order

# Base de datos SQLite en memoria compartida (StaticPool garantiza
# que todas las sesiones usen la misma conexión subyacente)
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ---------------------------------------------------------------------------
# Fixtures de infraestructura
# ---------------------------------------------------------------------------

@pytest.fixture
def reset_db():
    """Crea todas las tablas antes del test y las elimina al finalizar."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db(reset_db):
    """Sesión directa a la BD de prueba para sembrar datos (seeding)."""
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(reset_db):
    """Cliente HTTP que apunta a la BD de prueba en lugar de la real."""
    def override_get_db():
        session = TestingSession()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Fixtures de datos reutilizables
# ---------------------------------------------------------------------------

@pytest.fixture
def standard_service(db):
    service = Service(
        name="Estándar",
        description="Digitalización de documentos físicos",
        price_per_1000_pages=15.0,
        estimated_days=10,
        is_premium=False,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@pytest.fixture
def premium_service(db):
    service = Service(
        name="Premium",
        description="Digitalización + Bóveda Digital",
        price_per_1000_pages=25.0,
        estimated_days=7,
        is_premium=True,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@pytest.fixture
def price_extra(db):
    extra = Extra(
        name="Certificación de documentos",
        description="Sello de autenticidad por cada documento",
        price=50.0,
        percentage=0.0,
        reduces_delivery_days=False,
    )
    db.add(extra)
    db.commit()
    db.refresh(extra)
    return extra


@pytest.fixture
def percentage_extra(db):
    extra = Extra(
        name="Indexación avanzada",
        description="Metadatos adicionales",
        price=0.0,
        percentage=20.0,
        reduces_delivery_days=False,
    )
    db.add(extra)
    db.commit()
    db.refresh(extra)
    return extra


@pytest.fixture
def urgency_extra(db):
    extra = Extra(
        name="Digitalización urgente",
        description="Reduce 3 días el tiempo de entrega",
        price=30.0,
        percentage=0.0,
        reduces_delivery_days=True,
    )
    db.add(extra)
    db.commit()
    db.refresh(extra)
    return extra


@pytest.fixture
def base_quotation_payload():
    """Payload base válido para crear una cotización (service_id se rellena en el test)."""
    return {
        "company_name": "Empresa Test S.A.",
        "contact_name": "Ana García",
        "email": "ana@empresa.com",
        "phone": "612345678",
        "service_id": 1,
        "estimated_pages": 1000,
        "delivery_method": "digital",
        "pickup_date": "2026-06-01",
        "extra_ids": [],
    }


@pytest.fixture
def created_quotation(client, standard_service, base_quotation_payload):
    """Cotización ya creada en la BD de prueba."""
    payload = {**base_quotation_payload, "service_id": standard_service.id}
    response = client.post("/quotations/", json=payload)
    assert response.status_code == 200
    return response.json()


@pytest.fixture
def created_order(client, created_quotation):
    """Orden ya creada a partir de una cotización."""
    response = client.post("/orders/", json={
        "quotation_id": created_quotation["id"],
        "payment_method": "credit_card",
    })
    assert response.status_code == 200
    return response.json()


@pytest.fixture
def created_premium_order(client, db, premium_service, base_quotation_payload):
    """Orden Premium ya creada para tests de bóveda."""
    payload = {**base_quotation_payload, "service_id": premium_service.id}
    q_resp = client.post("/quotations/", json=payload)
    assert q_resp.status_code == 200

    o_resp = client.post("/orders/", json={
        "quotation_id": q_resp.json()["id"],
        "payment_method": "transfer",
    })
    assert o_resp.status_code == 200
    return o_resp.json()
