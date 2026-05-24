from app.models.service_model import Service


def seed_services(db):
    if db.query(Service).count() > 0:
        print("  [services] Ya contiene datos, se omite.")
        return

    services = [
        Service(
            name="Estándar",
            description="Digitalización de documentos físicos y entrega de archivos resultantes.",
            price_per_1000_pages=15.00,
            estimated_days=10,
            is_premium=False,
        ),
        Service(
            name="Premium",
            description="Digitalización + Bóveda Digital con Gestión Documental.",
            price_per_1000_pages=25.00,
            estimated_days=7,
            is_premium=True,
        ),
    ]

    db.add_all(services)
    db.commit()
    print(f"  [services] {len(services)} registros insertados.")
