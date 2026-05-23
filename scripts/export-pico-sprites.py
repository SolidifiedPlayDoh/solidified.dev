#!/usr/bin/env python3
"""Export pico atlas frames from femtanyl-2 to public/femtanylFNF/pico-sprites/."""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

from PIL import Image

MOD = Path("/Users/cardiffemde/Downloads/femtanyl-2")
ATLAS_XML = MOD / "images/characters/pico.xml"
ATLAS_PNG = MOD / "images/characters/pico.png"
OUT = Path(__file__).resolve().parent.parent / "public/femtanylFNF/pico-sprites"


def main() -> None:
    tree = ET.parse(ATLAS_XML)
    root = tree.getroot()
    sheet = Image.open(ATLAS_PNG)
    OUT.mkdir(parents=True, exist_ok=True)

    # prefix -> list of (index, subtexture name)
    groups: dict[str, list[tuple[int, str]]] = defaultdict(list)
    for st in root.findall("SubTexture"):
        name = st.attrib["name"]
        m = re.match(r"^([a-z]+)(\d+)$", name)
        if not m:
            continue
        prefix, idx = m.group(1), int(m.group(2))
        groups[prefix].append((idx, name))

    offsets: dict[str, list[list[int]]] = {}

    for prefix, items in sorted(groups.items()):
        items.sort(key=lambda t: t[0])
        offsets[prefix] = []
        for idx, name in items:
            st = root.find(f"SubTexture[@name='{name}']")
            assert st is not None
            x, y = int(st.attrib["x"]), int(st.attrib["y"])
            w, h = int(st.attrib["width"]), int(st.attrib["height"])
            fx = int(st.attrib.get("frameX", "0"))
            fy = int(st.attrib.get("frameY", "0"))
            # Keep solid black atlas background (no transparency flood-fill).
            crop = sheet.crop((x, y, x + w, y + h)).convert("RGBA")
            out_path = OUT / f"{prefix}{idx:04d}.png"
            crop.save(out_path)
            offsets[prefix].append([-fx, -fy])

    # Write offsets manifest for TS
    lines = ["export const PICO_OFFSETS: Record<string, [number, number][]> = {"]
    for prefix in sorted(offsets):
        pairs = ", ".join(f"[{a}, {b}]" for a, b in offsets[prefix])
        lines.append(f'  {prefix}: [{pairs}],')
    lines.append("};")
    (OUT / "offsets.ts").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Exported {sum(len(v) for v in groups.values())} frames to {OUT}")


if __name__ == "__main__":
    main()
