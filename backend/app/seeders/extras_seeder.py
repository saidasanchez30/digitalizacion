from app.models.extra_model import Extra


def seed_extras(db):
    if db.query(Extra).count() > 0:
        print("  [extras] Ya contiene datos, se omite.")
        return

    extras = [
        Extra(
            name="Digitalización urgente",
            description="Reduce el tiempo de entrega y aplica un cargo adicional del 30% sobre el subtotal.",
            price=0.0,
            percentage=0.30,
            reduces_delivery_days=True,
        ),
        Extra(
            name="OCR simulado",
            description="Reconocimiento óptico de caracteres aplicado sobre los documentos digitalizados.",
            price=50.0,
            percentage=0.0,
            reduces_delivery_days=False,
        ),
        Extra(
            name="Entrega física",
            description="Entrega de archivos en unidad física proporcionada por la empresa.",
            price=30.0,
            percentage=0.0,
            reduces_delivery_days=False,
        ),
    ]

    db.add_all(extras)
    db.commit()
    print(f"  [extras] {len(extras)} registros insertados.")
