"""
Tests de los endpoints de bóveda digital:
  POST  /orders/{id}/vault/documents
  GET   /orders/{id}/vault
"""

DOCUMENTO_BASE = {
    "file_name": "contrato_2026.pdf",
    "document_type": "Contrato",
    "category": "Legal",
    "department": "Jurídico",
    "description": "Contrato de arrendamiento de oficinas",
    "keywords": "contrato, arrendamiento, 2026",
    "storage_url": "s3://vault/contrato_2026.pdf",
    "security_status": "encrypted",
    "ocr_status": "not_applied",
}


class TestAgregarDocumentoABoveda:
    def test_agrega_documento_a_orden_premium(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        response = client.post(
            f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE
        )
        assert response.status_code == 200
        data = response.json()
        assert data["file_name"] == "contrato_2026.pdf"
        assert data["order_id"] == o_id

    def test_estado_orden_cambia_a_available_in_vault(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        client.post(f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE)
        order = client.get(f"/orders/{o_id}").json()
        assert order["order_status"] == "available_in_vault"

    def test_falla_agregar_documento_a_orden_estandar(
        self, client, created_order
    ):
        o_id = created_order["id"]
        response = client.post(
            f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE
        )
        assert response.status_code == 400
        assert "premium" in response.json()["detail"].lower()

    def test_falla_agregar_documento_a_orden_inexistente(self, client):
        response = client.post(
            "/orders/9999/vault/documents", json=DOCUMENTO_BASE
        )
        assert response.status_code == 400
        assert "no existe" in response.json()["detail"].lower()

    def test_falla_agregar_documento_a_orden_cancelada(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        client.put(f"/orders/{o_id}/status", json={"order_status": "cancelled"})
        response = client.post(
            f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE
        )
        assert response.status_code == 400
        assert "cancelada" in response.json()["detail"].lower()

    def test_campos_obligatorios_en_respuesta(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        response = client.post(
            f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE
        )
        data = response.json()
        campos = [
            "id", "order_id", "file_name", "document_type", "category",
            "security_status", "ocr_status", "storage_url", "created_at",
        ]
        for campo in campos:
            assert campo in data, f"Falta el campo '{campo}'"

    def test_campos_opcionales_persisten_en_respuesta(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        doc = {
            **DOCUMENTO_BASE,
            "confidentiality_level": "confidential",
            "retention_years": 5,
            "document_date": "2026-01-15",
        }
        response = client.post(f"/orders/{o_id}/vault/documents", json=doc)
        data = response.json()
        assert data["confidentiality_level"] == "confidential"
        assert data["retention_years"] == 5
        assert data["document_date"] == "2026-01-15"

    def test_puede_agregar_multiples_documentos(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        segundo = {**DOCUMENTO_BASE, "file_name": "nomina_2026.pdf"}
        client.post(f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE)
        client.post(f"/orders/{o_id}/vault/documents", json=segundo)

        docs = client.get(f"/orders/{o_id}/vault").json()
        assert len(docs) == 2


class TestListarDocumentosBoveda:
    def test_retorna_documentos_de_orden_premium(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        client.post(f"/orders/{o_id}/vault/documents", json=DOCUMENTO_BASE)

        response = client.get(f"/orders/{o_id}/vault")
        assert response.status_code == 200
        docs = response.json()
        assert len(docs) == 1
        assert docs[0]["file_name"] == "contrato_2026.pdf"

    def test_retorna_lista_vacia_sin_documentos(
        self, client, created_premium_order
    ):
        o_id = created_premium_order["id"]
        response = client.get(f"/orders/{o_id}/vault")
        assert response.status_code == 200
        assert response.json() == []

    def test_falla_listar_boveda_de_orden_estandar(
        self, client, created_order
    ):
        o_id = created_order["id"]
        response = client.get(f"/orders/{o_id}/vault")
        assert response.status_code == 400
        assert "premium" in response.json()["detail"].lower()

    def test_falla_listar_boveda_de_orden_inexistente(self, client):
        response = client.get("/orders/9999/vault")
        assert response.status_code == 400
        assert "no existe" in response.json()["detail"].lower()
