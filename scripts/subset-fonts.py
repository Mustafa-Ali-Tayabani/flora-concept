#!/usr/bin/env python3
"""
Rebuilds web/public/fonts/bricolage-grotesque-latin.woff2 from the @fontsource
variable font: French/Latin glyphs only, weight axis pinned at 500 (the only
weight the design uses for Bricolage), optical-size axis kept (display headings).
77 KB -> 33 KB: the display font is on the critical path of the LCP heading.

    python3 -m pip install fonttools brotli
    python3 scripts/subset-fonts.py
"""
from pathlib import Path
from fontTools.subset import main as subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2'
OUT = ROOT / 'web/public/fonts/bricolage-grotesque-latin.woff2'
UNICODES = ('U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+02C6,U+02DC,U+2009,U+200A,U+202F,'
            'U+2010-2014,U+2018-201E,U+2022,U+2026,U+2039,U+203A,U+20AC,U+2122,U+2192')

tmp = OUT.with_suffix('.tmp.woff2')
subset([str(SRC), f'--unicodes={UNICODES}', '--flavor=woff2',
        '--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk', f'--output-file={tmp}'])
font = instancer.instantiateVariableFont(TTFont(tmp), {'wght': 500})
font.flavor = 'woff2'
font.save(OUT)
tmp.unlink()
print(f'{OUT.name}: {OUT.stat().st_size // 1024} KB')
