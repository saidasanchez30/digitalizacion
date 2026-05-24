"""
Tests del endpoint GET /services/
"""


class TestListarServicios:
    def test_retorna_lista_vacia_sin_datos(self, client):
        response = client.get("/services/")
        assert response.status_code == 200
        assert response.json() == []

    def test_retorna_servicio_estandar_creado(self, client, standard_service):
        response = client.get("/services/")
        assert response.status_code == 200
        services = response.json()
        assert len(services) == 1
        assert services[0]["name"] == "Estándar"
        assert services[0]["is_premium"] is False

    def test_retorna_servicio_premium_creado(self, client, premium_service):
        response = client.get("/services/")
        services = response.json()
        assert len(services) == 1
        assert services[0]["is_premium"] is True

    def test_retorna_ambos_servicios_cuando_existen(
        self, client, standard_service, premium_service
    ):
        response = client.get("/services/")
        assert len(response.json()) == 2

    def test_campos_obligatorios_presentes_en_respuesta(
        self, client, standard_service
    ):
        response = client.get("/services/")
        service = response.json()[0]
        campos = ["id", "name", "description", "price_per_1000_pages", "estimated_days", "is_premium"]
        for campo in campos:
            assert campo in service, f"Falta el campo '{campo}' en la respuesta"

    def test_precio_y_dias_son_correctos(self, client, standard_service):
        response = client.get("/services/")
        service = response.json()[0]
        assert service["price_per_1000_pages"] == 15.0
        assert service["estimated_days"] == 10
