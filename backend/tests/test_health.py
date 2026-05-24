"""
Tests del endpoint raíz — verificación básica del servidor.
"""


class TestHealth:
    def test_servidor_responde_correctamente(self, client):
        response = client.get("/")
        assert response.status_code == 200

    def test_respuesta_contiene_mensaje_de_confirmacion(self, client):
        response = client.get("/")
        body = response.json()
        assert "message" in body
        assert "funcionando" in body["message"].lower()

    def test_content_type_es_json(self, client):
        response = client.get("/")
        assert "application/json" in response.headers["content-type"]
