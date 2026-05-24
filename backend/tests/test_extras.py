"""
Tests del endpoint GET /extras/
"""


class TestListarExtras:
    def test_retorna_lista_vacia_sin_datos(self, client):
        response = client.get("/extras/")
        assert response.status_code == 200
        assert response.json() == []

    def test_retorna_extra_de_precio_fijo(self, client, price_extra):
        response = client.get("/extras/")
        extras = response.json()
        assert len(extras) == 1
        assert extras[0]["price"] == 50.0
        assert extras[0]["percentage"] == 0.0
        assert extras[0]["reduces_delivery_days"] is False

    def test_retorna_extra_de_porcentaje(self, client, percentage_extra):
        response = client.get("/extras/")
        extras = response.json()
        assert extras[0]["percentage"] == 20.0
        assert extras[0]["price"] == 0.0

    def test_retorna_extra_de_urgencia(self, client, urgency_extra):
        response = client.get("/extras/")
        extras = response.json()
        assert extras[0]["reduces_delivery_days"] is True

    def test_retorna_todos_los_extras_existentes(
        self, client, price_extra, percentage_extra, urgency_extra
    ):
        response = client.get("/extras/")
        assert len(response.json()) == 3

    def test_campos_obligatorios_presentes_en_respuesta(
        self, client, price_extra
    ):
        response = client.get("/extras/")
        extra = response.json()[0]
        campos = ["id", "name", "description", "price", "percentage", "reduces_delivery_days"]
        for campo in campos:
            assert campo in extra, f"Falta el campo '{campo}' en la respuesta"
