"""Import the December 2026 PDF with Poppler's pdftotext (brew install poppler)."""

import argparse
from datetime import datetime
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("pdf", type=Path)
parser.add_argument("--check", action="store_true", help="Verify without writing")
args = parser.parse_args()
text = subprocess.run(
    ["pdftotext", "-layout", str(args.pdf), "-"],
    check=True, capture_output=True, text=True,
).stdout
assert "DECEMBER 2026 - TENTATIVE FINAL EXAMINATION SCHEDULE" in text

exams = []
seen = set()
source_rows = 0
for line in text.splitlines():
    # Check every dated row, including subjects containing digits (NUR1, FMT4).
    if not re.match(r"^\s*[A-Z][A-Z0-9]{2,3}\s+\d{3}", line):
        continue
    source_rows += 1
    columns = re.split(r"\s{2,}", line.strip())
    assert len(columns) == 6, f"Unexpected columns: {line}"
    course, section, title, exam_type, start, end = columns
    assert re.fullmatch(r"[A-Z][A-Z0-9]{2,3} \d{3}[A-Z0-9]{0,3}", course), course
    assert re.fullmatch(r"\d{3}[A-Z]?\d?", section), section
    start = datetime.strptime(start, "%d %b-%Y at %I:%M %p")
    end = datetime.strptime(end, "%d %b-%Y at %I:%M %p")
    assert start < end, line
    assert start.year == end.year == 2026 and start.month in (11, 12) and end.month in (11, 12), line
    exam = dict(course=course, section=section, title=title, type=exam_type,
                start=start.isoformat(timespec="minutes"), end=end.isoformat(timespec="minutes"))
    key = tuple(exam.values())
    if key not in seen:
        exams.append(exam)
        seen.add(key)

assert source_rows == 799, f"Expected 799 source rows, got {source_rows}"
assert len(exams) == 798, "Expected one duplicate CIVE 320 row in this PDF"
digest = hashlib.sha256(args.pdf.read_bytes()).hexdigest()
output = (
    "// Auto-generated from McGill December 2026 Tentative Final Examination Schedule.\n"
    f"// Source: {args.pdf.name}\n"
    f"// SHA-256: {digest}\n"
    "// 799 source rows; 798 unique exams (identical CIVE 320 row appears twice).\n"
    "// Times are Montreal local time (EST). Room locations are not yet published.\n"
    "import type { Exam } from './types'\n\n"
    "export const EXAMS: Exam[] = " + json.dumps(exams, indent=2, ensure_ascii=False) + ";\n"
)
destination = ROOT / "src/data/exams.ts"
if args.check:
    assert destination.read_text() == output, "Exam data differs from the source PDF"
else:
    destination.write_text(output)
print(f"{'Verified' if args.check else 'Imported'} {len(exams)} unique exams from {source_rows} PDF rows.")
