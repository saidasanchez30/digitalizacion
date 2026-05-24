"""
Ejecuta la suite de tests y exporta los resultados a CSV.

Uso:
    python run_tests.py
    python run_tests.py --output mi_archivo.csv
    python run_tests.py --module tests/test_orders.py
"""

import argparse
import csv
import sys
from datetime import datetime
from pathlib import Path

import pytest

CAMPOS_CSV = [
    "id",
    "modulo",
    "clase",
    "nombre_test",
    "estado",
    "duracion_seg",
    "mensaje_error",
]

ESTADO_EMOJI = {
    "PASSED": "✅ PASSED",
    "FAILED": "❌ FAILED",
    "ERROR":  "💥 ERROR",
    "SKIPPED": "⏭  SKIPPED",
}


class _CSVCollector:
    """Plugin interno de pytest que captura los resultados de cada test."""

    def __init__(self):
        self.rows: list[dict] = []
        self._counter = 0

    def _parse_node(self, nodeid: str) -> tuple[str, str, str]:
        partes = nodeid.split("::")
        modulo = partes[0].replace("tests/", "").replace(".py", "")
        clase = partes[1] if len(partes) > 2 else ""
        nombre = partes[-1]
        return modulo, clase, nombre

    def _mensaje(self, longrepr) -> str:
        if longrepr is None:
            return ""
        texto = str(longrepr)
        lineas = [l.strip() for l in texto.splitlines() if l.strip()]
        return lineas[-1] if lineas else texto[:200]

    def pytest_runtest_logreport(self, report):
        if report.when == "call":
            estado = "PASSED" if report.passed else ("FAILED" if report.failed else "SKIPPED")
            mensaje = "" if report.passed else self._mensaje(report.longrepr)
        elif report.when == "setup" and report.failed:
            estado = "ERROR"
            mensaje = self._mensaje(report.longrepr)
        else:
            return

        self._counter += 1
        modulo, clase, nombre = self._parse_node(report.nodeid)

        self.rows.append({
            "id": self._counter,
            "modulo": modulo,
            "clase": clase,
            "nombre_test": nombre,
            "estado": estado,
            "duracion_seg": f"{report.duration:.4f}",
            "mensaje_error": mensaje,
        })


def _escribir_csv(rows: list[dict], path: Path, fecha: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    with open(path, "w", newline="", encoding="utf-8") as f:
        # Cabecera de metadatos (comentario)
        f.write(f"# Suite: API Digitalización Documental\n")
        f.write(f"# Fecha ejecución: {fecha}\n")
        f.write(f"# Total tests: {len(rows)}\n")

        writer = csv.DictWriter(f, fieldnames=CAMPOS_CSV)
        writer.writeheader()
        writer.writerows(rows)


def _imprimir_resumen(rows: list[dict], path: Path, elapsed: float) -> None:
    conteo = {"PASSED": 0, "FAILED": 0, "ERROR": 0, "SKIPPED": 0}
    for r in rows:
        conteo[r["estado"]] = conteo.get(r["estado"], 0) + 1

    print("\n" + "─" * 60)
    print(f"  Resultados guardados en: {path}")
    print("─" * 60)
    print(f"  Total      : {len(rows)}")
    print(f"  ✅ Pasados  : {conteo['PASSED']}")
    print(f"  ❌ Fallidos : {conteo['FAILED']}")
    print(f"  💥 Errores  : {conteo['ERROR']}")
    print(f"  ⏭  Omitidos : {conteo['SKIPPED']}")
    print(f"  Tiempo total: {elapsed:.2f}s")
    print("─" * 60)

    if conteo["FAILED"] or conteo["ERROR"]:
        print("\n  Tests que necesitan atención:")
        for r in rows:
            if r["estado"] in ("FAILED", "ERROR"):
                print(f"    {ESTADO_EMOJI[r['estado']]}  {r['modulo']}::{r['clase']}::{r['nombre_test']}")
                if r["mensaje_error"]:
                    print(f"            → {r['mensaje_error']}")
        print()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Ejecuta tests y exporta resultados a CSV")
    parser.add_argument(
        "--output", "-o",
        default="test-results/results.csv",
        help="Ruta del archivo CSV de salida (default: test-results/results.csv)",
    )
    parser.add_argument(
        "--module", "-m",
        default="tests/",
        help="Módulo o directorio de tests a ejecutar (default: tests/)",
    )
    args = parser.parse_args(argv)

    fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    path = Path(args.output)

    collector = _CSVCollector()

    t0 = datetime.now()
    exit_code = pytest.main([args.module, "-v", "--tb=short"], plugins=[collector])
    elapsed = (datetime.now() - t0).total_seconds()

    _escribir_csv(collector.rows, path, fecha)
    _imprimir_resumen(collector.rows, path, elapsed)

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
