"""
Tests de los endpoints POST /quotations/ y GET /quotations/
"""
import pytest


PAYLOAD_BASE = {
    "company_name": "Empresa Test S.A.",
    "contact_name": "Ana García",
    "email": "ana@empresa.com",
    "phone": "612345678",
    "estimated_pages": 1000,
    "delivery_method": "digital",
    "pickup_date": "2026-06-01",
    "extra_ids": [],
}


class TestCrearCotizacion:
    def test_crea_cotizacion_servicio_estandar_sin_extras(
        self, client, standard_service
    ):
        payload = {**PAYLOAD_BASE, "service_id": standard_service.id}
        response = client.post("/quotations/", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["company_name"] == "Empresa Test S.A."
        assert data["status"] == "quotation_generated"

    def test_subtotal_calculado_correctamente(self, client, standard_service):
        # 2000 páginas a 15€/1000 → subtotal = 30.0
        payload = {**PAYLOAD_BASE, "service_id": standard_service.id, "estimated_pages": 2000}
        response = client.post("/quotations/", json=payload)
        data = response.json()
        assert data["subtotal"] == pytest.approx(30.0)
        assert data["extras_total"] == pytest.approx(0.0)
        assert data["total"] == pytest.approx(30.0)

    def test_extras_total_con_precio_fijo(
        self, client, standard_service, price_extra
    ):
        # 1000 páginas a 15€/1000 → subtotal 15. extra precio fijo 50 → total 65
        payload = {
            **PAYLOAD_BASE,
            "service_id": standard_service.id,
            "estimated_pages": 1000,
            "extra_ids": [price_extra.id],
        }
        response = client.post("/quotations/", json=payload)
        data = response.json()
        assert data["subtotal"] == pytest.approx(15.0)
        assert data["extras_total"] == pytest.approx(50.0)
        assert data["total"] == pytest.approx(65.0)

    def test_extras_total_con_porcentaje(
        self, client, standard_service, percentage_extra
    ):
        # 1000 páginas a 15€/1000 → subtotal 15. extra 20% → extras_total 3.0 → total 18.0
        payload = {
            **PAYLOAD_BASE,
            "service_id": standard_service.id,
            "estimated_pages": 1000,
            "extra_ids": [percentage_extra.id],
        }
        response = client.post("/quotations/", json=payload)
        data = response.json()
        assert data["subtotal"] == pytest.approx(15.0)
        assert data["extras_total"] == pytest.approx(3.0)
        assert data["total"] == pytest.approx(18.0)

    def test_fecha_entrega_estimada_sin_urgencia(
        self, client, standard_service
    ):
        # Servicio estándar: 10 días → entrega = 2026-06-11
        payload = {**PAYLOAD_BASE, "service_id": standard_service.id}
        response = client.post("/quotations/", json=payload)
        data = response.json()
        assert data["estimated_delivery_date"] == "2026-06-11"

    def test_fecha_entrega_reducida_con_extra_urgente(
        self, client, standard_service, urgency_extra
    ):
        # Servicio estándar 10 días − 3 urgencia = 7 días → entrega = 2026-06-08
        payload = {
            **PAYLOAD_BASE,
            "service_id": standard_service.id,
            "extra_ids": [urgency_extra.id],
        }
        response = client.post("/quotations/", json=payload)
        data = response.json()
        assert data["estimated_delivery_date"] == "2026-06-08"

    def test_falla_con_servicio_inexistente(self, client):
        payload = {**PAYLOAD_BASE, "service_id": 9999}
        response = client.post("/quotations/", json=payload)
        assert response.status_code == 400
        assert "servicio" in response.json()["detail"].lower()

    def test_falla_con_email_invalido(self, client, standard_service):
        payload = {
            **PAYLOAD_BASE,
            "service_id": standard_service.id,
            "email": "no-es-un-email",
        }
        response = client.post("/quotations/", json=payload)
        assert response.status_code == 422

    def test_campos_obligatorios_en_respuesta(self, client, standard_service):
        payload = {**PAYLOAD_BASE, "service_id": standard_service.id}
        response = client.post("/quotations/", json=payload)
        data = response.json()
        campos = [
            "id", "company_name", "contact_name", "email", "phone",
            "service_id", "estimated_pages", "delivery_method",
            "pickup_date", "estimated_delivery_date",
            "subtotal", "extras_total", "total", "status", "created_at",
        ]
        for campo in campos:
            assert campo in data, f"Falta el campo '{campo}'"

    def test_extras_devueltos_en_respuesta(
        self, client, standard_service, price_extra
    ):
        payload = {
            **PAYLOAD_BASE,
            "service_id": standard_service.id,
            "extra_ids": [price_extra.id],
        }
        response = client.post("/quotations/", json=payload)
        data = response.json()
        assert len(data["extras"]) == 1
        assert data["extras"][0]["extra_id"] == price_extra.id


class TestListarCotizaciones:
    def test_lista_vacia_sin_cotizaciones(self, client):
        response = client.get("/quotations/")
        assert response.status_code == 200
        assert response.json() == []

    def test_lista_cotizaciones_existentes(self, client, created_quotation):
        response = client.get("/quotations/")
        assert len(response.json()) == 1

    def test_obtener_cotizacion_por_id(self, client, created_quotation):
        q_id = created_quotation["id"]
        response = client.get(f"/quotations/{q_id}")
        assert response.status_code == 200
        assert response.json()["id"] == q_id

    def test_obtener_cotizacion_id_inexistente_retorna_404(self, client):
        response = client.get("/quotations/9999")
        assert response.status_code == 404
        assert "cotización" in response.json()["detail"].lower()
