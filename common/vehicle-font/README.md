# onRouteBC_Configurations Font

This repository defines a custom symbol font used by the **onRouteBC** project to dynamically render vehicle configuration diagrams. Each glyph corresponds to a visual vehicle component — power unit, trailer, booster, or axle group — and full vehicle combinations are created by typing structured ligatures.

---

## 🎯 Purpose

This font system replaces a static image-based workflow with a scalable, typable, and maintainable solution:

- Dynamically generate diagrams for any axle configuration
- Type a glyph sequence instead of mapping image files
- No need to manually sketch or assign images to configurations
- Fully scalable across unique, rare, or emerging equipment layouts

---

## 🔤 Character-to-Symbol Mapping Overview

Each glyph is triggered by a **ligature string**. Basic structure:

```
[Axle Count][Glyph Type][Axle Unit #][(Spacing)]
```

### 🔸 Vehicle Types and Glyph Symbols

| Vehicle Category     | Ligature Format          | Notes |
|----------------------|--------------------------|-------|
| Truck Tractor        | `TT1S1`, `2D2--`          | Use `S` for steer (with `TT` prefix), `D` for drive axles |
| Mobile Crane         | `MC2S1-`, `3A2--`         | Use `S` for steer (with `MC`), and `A` for drive/additional axles |
| Jeep                 | `2J3-`                    | Axles 1–4, supports dash spacing |
| Trailer              | `3T4--`                   | Tridem = 2 trailing dashes |
| Booster              | `4B5---`                  | Quad axle unit = 3 dashes |
| Additional Axles     | `1A6`                     | For mobile cranes or complex trailers |
| Universal Axle Units | `U1`, `4+U2===XUXUEU`     | Used for axle units >4 axles or abstract layouts |

### 🔸 Axle Unit Numbering

All axle units must be numbered in sequence (mandatory for spacing):

- Units 1–9: `TT1S1`, `2D2`
- Units 10–40: use a dot prefix `.##` → e.g. `1A.11`

### 🔸 Spacing Rules

| Type              | Spacing Symbol | Notes |
|-------------------|----------------|-------|
| Regular Glyphs    | `-`            | Use `axles - 1` dashes after glyph |
| Universal Glyphs  | `=`            | Use 3 equal signs after `4+U#` (regardless of total axles) |

**Examples:**

- `TT1S11D2` → Single steer, single drive truck tractor  
- `TT2S1-3D2--` → Tandem steer, tridem drive truck tractor  
- `2J34T4---` → Tandem jeep (unit 3), quad trailer (unit 4)  
- `4+U2===XUXUEU` → 7-axle universal unit as axle unit 2

---

## 🧩 Universal Glyph Construction

For axle units >4 axles:

```
4+U2===XUXUEU
```

- `4+U2` = Base 4-axle unit, labeled as axle unit 2  
- `===` = Constant spacing  
- `XU` = Extra axles  
- `EU` = End axle glyph (last wheel)

---

## 🧪 Live Testing

**HTML Preview Interface:**  
Open in any browser:

```
vehicle-font/generated/test-font.html
```

- Type a ligature string to view diagram output
- Includes pre-built configuration buttons
- Font size toggles: 64pt, 128pt, 256pt

---

## 📐 Rendering Best Practices

- Best sizes: **128pt** or **256pt**
- Avoid sizes <64pt (loss of detail)
- Stick to **powers of 2** for crisp rendering (avoid 90pt, 150pt, etc.)

---

## 🛠️ Font Development Tools

### Design in Inkscape

- Each glyph is its own `.svg`  
- Original files:  
  `vehicle-font/svg-glyphs/inkscape-svg/`
- Size: **1000px tall**, variable width

### Import into FontForge

- FontForge project:  
  `vehicle-font/onRouteBC Configurations.sfd`
- Registered font name:  
  `onRouteBC_Configurations`

#### Modify a Glyph

1. Open glyph in Inkscape
2. Save over original (Inkscape SVG format)
3. Save a copy as **Plain SVG** to:  
   `vehicle-font/svg-glyphs/plain-svg/`
4. In FontForge:
   - Open `.sfd` file
   - Open glyph slot → `Ctrl+A` → `Delete`
   - `File → Import` plain SVG
   - `Element → Round → To Int` (to snap points)
   - Adjust bearings/spacing as needed
   - Use Metrics Window to preview

5. Save project → `File → Generate Fonts`

---

## 🔧 Automation Scripts

All scripts include instructions in code comments. Not required, but helpful:

| Script                             | Description |
|------------------------------------|-------------|
| `update-font-with-svg.py`          | Replaces all glyphs in the `.sfd` using Plain SVGs |
| `_export-plain-svg.bat`            | Exports all Inkscape SVGs to Plain SVG format |
| `_normalize-group-ids.py`          | Preprocessing step for consistent group IDs (needed for batch transforms) |
| `_translate-objects.bat`           | Example batch adjustment (e.g. repositioning all SVG glyphs) |

---

## 🗂 Directory Structure

```
vehicle-font/
├── onRouteBC Configurations.sfd       # FontForge project
├── onRouteBC_Configurations.woff2     # Web font (primary use)
├── onRouteBC_Configurations.ttf       # TrueType (PDF/export usage)
├── onRouteBC_Configurations.otf       # OpenType font
├── onRouteBC_Configurations.svg       # Legacy/optional format
│
├── /svg-glyphs/
│   ├── /inkscape-svg/                 # Editable master glyphs
│   └── /plain-svg/                    # Exported clean SVGs for FontForge
│
├── /generated/
│   ├── test-font.html                 # Live preview tester
│   ├── _export-plain-svg.bat         # Batch SVG exporter
│   ├── _normalize-group-ids.py       # ID cleaning script
│   ├── _translate-objects.bat        # Sample SVG transform script
```

---

## 🔡 Font Files

| File Name                        | Format | Use Case |
|----------------------------------|--------|----------|
| `onRouteBC_Configurations.woff2` | WOFF2  | Web frontend (primary use) |
| `onRouteBC_Configurations.ttf`   | TTF    | Embedding in PDFs or apps |
| `onRouteBC_Configurations.otf`   | OTF    | Alternative for desktop publishing |
| `onRouteBC_Configurations.svg`   | SVG    | Legacy or vector workflows |

---

🖋 Font Design: Inkscape + FontForge  
💻 Frontend Use: `.woff2`  
🖨 Print Support: `.ttf` or `.otf`  
📁 Reproducible & Scriptable Glyph Pipeline
