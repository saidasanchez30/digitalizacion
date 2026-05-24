"""
Tests de los endpoints de órdenes:
  POST   /orders/
  GET    /orders/
  GET    /orders/{id}
  POST   /orders/{id}/cancel
  PUT    /orders/{id}/status
"""


class TestCrearOrden:
    def test_crea_orden_desde_cotizacion_valida(
        self, client, created_quotation
    ):
        response = client.post("/orders/", json={
            "quotation_id": created_quotation["id"],
            "payment_method": "credit_card",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["quotation_id"] == created_quotation["id"]
        assert data["payment_method"] == "credit_card"

    def test_orden_creada_con_estado_inicial_correcto(
        self, client, created_quotation
    ):
        response = client.post("/orders/", json={
            "quotation_id": created_quotation["id"],
            "payment_method": "transfer",
        })
        data = response.json()
        assert data["order_status"] == "pickup_scheduled"
        assert data["payment_status"] == "payment_confirmed"

    def test_falla_con_cotizacion_inexistente(self, client):
        response = client.post("/orders/", json={
            "quotation_id": 9999,
            "payment_method": "credit_card",
        })
        assert response.status_code == 400
        assert "cotización" in response.json()["detail"].lower()

    def test_falla_si_ya_existe_orden_para_esa_cotizacion(
        self, client, created_quotation
    ):
        payload = {"quotation_id": created_quotation["id"], "payment_method": "credit_card"}
        client.post("/orders/", json=payload)
        response = client.post("/orders/", json=payload)
        assert response.status_code == 400
        assert "ya existe" in response.json()["detail"].lower()

    def test_falla_con_cotizacion_cancelada(self, client, created_quotation):
        order_resp = client.post("/orders/", json={
            "quotation_id": created_quotation["id"],
            "payment_method": "credit_card",
        })
        order_id = order_resp.json()["id"]
        client.post(f"/orders/{order_id}/cancel")

        # Intentar crear otra orden para la misma cotización (ahora cancelada)
        response = client.post("/orders/", json={
            "quotation_id": created_quotation["id"],
            "payment_method": "transfer",
        })
        assert response.status_code == 400

    def test_campos_obligatorios_presentes_en_respuesta(
        self, client, created_quotation
    ):
        response = client.post("/orders/", json={
            "quotation_id": created_quotation["id"],
            "payment_method": "credit_card",
        })
        data = response.json()
        campos = ["id", "quotation_id", "payment_method", "payment_status", "order_status", "created_at"]
        for campo in campos:
            assert campo in data, f"Falta el campo '{campo}'"


class TestListarOrdenes:
    def test_lista_vacia_sin_ordenes(self, client):
        response = client.get("/orders/")
        assert response.status_code == 200
        assert response.json() == []

    def test_lista_ordenes_existentes(self, client, created_order):
        response = client.get("/orders/")
        assert len(response.json()) == 1

    def test_obtener_orden_por_id(self, client, created_order):
        o_id = created_order["id"]
        response = client.get(f"/orders/{o_id}")
        assert response.status_code == 200
        assert response.json()["id"] == o_id

    def test_obtener_orden_id_inexistente_retorna_404(self, client):
        response = client.get("/orders/9999")
        assert response.status_code == 404
        assert "orden" in response.json()["detail"].lower()


class TestCancelarOrden:
    def test_cancela_orden_en_estado_pickup_scheduled(
        self, client, created_order
    ):
        o_id = created_order["id"]
        response = client.post(f"/orders/{o_id}/cancel")
        assert response.status_code == 200
        data = response.json()
        assert data["order_status"] == "cancelled"
        assert data["payment_status"] == "refund_pending"

    def test_falla_cancelar_orden_ya_cancelada(
        self, client, created_order
    ):
        o_id = created_order["id"]
        client.post(f"/orders/{o_id}/cancel")
        response = client.post(f"/orders/{o_id}/cancel")
        assert response.status_code == 400
        assert "ya está cancelada" in response.json()["detail"].lower()

    def test_falla_cancelar_orden_en_proceso_de_digitalizacion(
        self, client, created_order
    ):
        o_id = created_order["id"]
        client.put(f"/orders/{o_id}/status", json={"order_status": "digitizing"})
        response = client.post(f"/orders/{o_id}/cancel")
        assert response.status_code == 400
        assert "ya inició" in response.json()["detail"].lower()

    def test_falla_cancelar_orden_inexistente(self, client):
        response = client.post("/orders/9999/cancel")
        assert response.status_code == 400
        assert "no existe" in response.json()["detail"].lower()


class TestActualizarEstadoOrden:
    def test_actualiza_a_estado_documents_collected(
        self, client, created_order
    ):
        o_id = created_order["id"]
        response = client.put(f"/orders/{o_id}/status", json={"order_status": "documents_collected"})
        assert response.status_code == 200
        assert response.json()["order_status"] == "documents_collected"

    def test_recorre_flujo_completo_de_estados(self, client, created_order):
        o_id = created_order["id"]
        flujo = [
            "documents_collected",
            "digitizing",
            "quality_review",
            "preparing_delivery",
            "delivered",
        ]
        for estado in flujo:
            resp = client.put(f"/orders/{o_id}/status", json={"order_status": estado})
            assert resp.status_code == 200, f"Falló en estado: {estado}"
            assert resp.json()["order_status"] == estado

    def test_falla_con_estado_invalido(self, client, created_order):
        o_id = created_order["id"]
        response = client.put(f"/orders/{o_id}/status", json={"order_status": "estado_inventado"})
        assert response.status_code == 400
        assert "válido" in response.json()["detail"].lower()

    def test_falla_actualizar_orden_cancelada(self, client, created_order):
        o_id = created_order["id"]
        client.post(f"/orders/{o_id}/cancel")
        response = client.put(f"/orders/{o_id}/status", json={"order_status": "digitizing"})
        assert response.status_code == 400
        assert "cancelada" in response.json()["detail"].lower()

    def test_falla_actualizar_orden_entregada(self, client, created_order):
        o_id = created_order["id"]
        client.put(f"/orders/{o_id}/status", json={"order_status": "delivered"})
        response = client.put(f"/orders/{o_id}/status", json={"order_status": "digitizing"})
        assert response.status_code == 400
        assert "entregada" in response.json()["detail"].lower()

    def test_falla_actualizar_orden_inexistente(self, client):
        response = client.put("/orders/9999/status", json={"order_status": "digitizing"})
        assert response.status_code == 400
        assert "no existe" in response.json()["detail"].lower()
