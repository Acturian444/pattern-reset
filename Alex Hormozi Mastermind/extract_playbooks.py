#!/usr/bin/env python3
"""
Re-extract $100M playbooks from PDFs in Downloads and write Markdown to this folder.
Requires: pip install pymupdf
Run from repo with full disk access if Downloads is restricted: python3 extract_playbooks.py
"""
import os
import re
import sys

try:
    import fitz
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf", "-q"])
    import fitz

BASE = os.environ.get("HORMOZI_PDF_DIR", os.path.expanduser("~/Downloads"))
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

PDFS = [
    "$100M Branding Playbook.pdf",
    "$100M Closing Playbook.pdf",
    "$100M Fast Cash Playbook.pdf",
    "$100M Goated Ads Playbook.pdf",
    "$100M Hooks Playbook.pdf",
    "$100M Lead Nurture Playbook.pdf",
    "$100M Lifetime Value Playbook.pdf",
    "$100M Marketing Machine.pdf",
    "$100M Price Raise Playbook.pdf",
    "$100M Pricing Playbook.pdf",
    "$100M Retention Playbook.pdf",
]

ROMAN = re.compile(r"^(i{1,3}|iv|vi{0,3}|ix|x{0,3}xi{0,3}|xiv|xix|xx|xxx)$", re.I)


def is_toc_line(line: str) -> bool:
    s = line.strip()
    if not s or s == "Table of Contents":
        return False
    if s.count(".") >= 8 and re.search(r"\d{1,3}\s*$", s):
        return True
    if re.search(r"(\.\s+){4,}", s) and re.search(r"\d{1,3}\s*$", s):
        return True
    return False


def clean_body(text: str) -> str:
    text = text.replace("\x08", "").replace("\ufeff", "")
    text = re.sub(
        r"Copyright © \d{4} by Alex Hormozi.*?requests, write to the publisher at the address below\.\s*",
        "",
        text,
        flags=re.S | re.I,
    )
    text = re.sub(
        r"Acquisition\.com\s*\n\s*7710 N FM 620.*?\n",
        "\n",
        text,
        flags=re.S,
    )
    for quote in ("Here’s", "Here's"):
        text = re.sub(
            rf"{quote} a generic legal disclaimer for a book about making money:\s*LEGAL DISCLAIMER\s*.*?"
            r"By reading this book, you acknowledge that you are responsible for your own choices, actions, and\s*results\.\s*",
            "",
            text,
            flags=re.S,
        )
    lines = []
    skip_toc = False
    for line in text.splitlines():
        if line.strip() == "Table of Contents":
            skip_toc = True
            continue
        if skip_toc:
            if is_toc_line(line):
                continue
            skip_toc = False
        if is_toc_line(line):
            continue
        lines.append(line)
    text = "\n".join(lines)
    out_lines = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            out_lines.append("")
            continue
        if re.fullmatch(r"\d{1,4}", s):
            continue
        if ROMAN.fullmatch(s) and len(s) <= 4:
            continue
        out_lines.append(line)
    text = "\n".join(out_lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_copyright_lines(text: str) -> str:
    text = re.sub(
        r"^Copyright © \d{4}.*?(?:NOT FOR DISTRIBUTION|All rights reserved)\s*\n?",
        "",
        text,
        flags=re.I | re.M,
    )
    text = re.sub(r"^Copyright © \d{4}.*\n", "", text, flags=re.M)
    return text


def fix_closing(text: str) -> str:
    if not text.startswith("# Closing Playbook"):
        return text
    text = strip_copyright_lines(text)
    note = (
        "> **Source note:** Text was extracted from the PDF’s text layer. Some passages "
        "(especially mid-document) may show OCR or layout artifacts; the bundled PDF is the canonical source.\n\n"
    )
    m = re.search(r"\nStart Here\n((?:Houw|How) to get them to say yes)", text)
    if not m:
        return text
    tail = text[m.start() + 1 :]
    tail = tail.split("\n", 1)[1]
    return f"# Closing Playbook\n\n{note}## Start Here\n{tail}"


def main():
    for name in PDFS:
        path = os.path.join(BASE, name)
        if not os.path.isfile(path):
            print("Missing:", path, file=sys.stderr)
            continue
        doc = fitz.open(path)
        parts = [page.get_text("text") for page in doc]
        raw = "\n".join(parts)
        stem = name.replace(".pdf", "").replace("$100M ", "100M-").replace(" ", "-")
        md_path = os.path.join(OUT_DIR, stem + ".md")
        title = name.replace(".pdf", "").replace("$100M ", "")
        body = clean_body(raw)
        text = f"# {title}\n\n{body}\n"
        text = strip_copyright_lines(text)
        if stem == "100M-Closing-Playbook":
            text = fix_closing(text)
        else:
            text = re.sub(r"\n{3,}", "\n\n", text)
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(text.strip() + "\n")
        print("Wrote", md_path)


if __name__ == "__main__":
    main()
