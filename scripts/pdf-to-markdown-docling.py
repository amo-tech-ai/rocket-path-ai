#!/usr/bin/env python3
"""
Convert PDFs in research/pdfs/ to Markdown using Docling.
Output: research/markdown/<basename>.md

Requires: Python 3.10+, pip install docling
Run from project root:
  python3 -m venv .venv-docling && .venv-docling/bin/pip install docling
  .venv-docling/bin/python scripts/pdf-to-markdown-docling.py
  # Optional: keep image refs in markdown → .venv-docling/bin/python scripts/pdf-to-markdown-docling.py --keep-images
"""

from pathlib import Path
import re
import sys

# Project root = parent of scripts/
ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / "research" / "pdfs"
OUT_DIR = ROOT / "research" / "markdown"


def strip_image_lines(text: str) -> str:
    """Remove lines that are only image refs (better for RAG chunking)."""
    return re.sub(r"^!\[[^\]]*\]\([^)]+\)\s*$", "", text, flags=re.MULTILINE)


def main() -> None:
    try:
        from docling.document_converter import DocumentConverter
    except ImportError:
        print("Install Docling: pip install docling", file=sys.stderr)
        sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"No PDFs in {PDF_DIR}")
        return

    converter = DocumentConverter()
    strip_images = "--keep-images" not in sys.argv

    for i, pdf_path in enumerate(pdfs, 1):
        out_name = pdf_path.stem + ".md"
        out_path = OUT_DIR / out_name
        print(f"[{i}/{len(pdfs)}] {pdf_path.name} -> {out_path.relative_to(ROOT)}")
        try:
            result = converter.convert(str(pdf_path))
            md = result.document.export_to_markdown()
            if strip_images:
                md = strip_image_lines(md)
            out_path.write_text(md, encoding="utf-8")
        except Exception as e:
            print(f"  ERROR: {e}", file=sys.stderr)

    print(f"Done. {len(pdfs)} PDFs -> {OUT_DIR}")


if __name__ == "__main__":
    main()
