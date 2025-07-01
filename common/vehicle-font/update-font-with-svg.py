"""
update-font-with-svg.py
────────────────────────

This script updates glyphs in a FontForge `.sfd` font file using replacement outlines
from a directory of SVG files. It does not update the main .sfd file in place, but
creates a new ' - Updated.sfd' file alongside. Once validated, this updated file 
should replace the original.

💡 What It Does:
- For each SVG file in a specified directory, it:
  • Matches the SVG filename with a glyph name in the font.
  • Stores that glyph's existing left and right side bearings.
  • Clears the glyph’s current outline.
  • Imports the new outline from the SVG file.
  • Restores the original side bearings.
  • Saves the new font file with an ' - Updated' suffix.

🔒 Restrictions & Assumptions:
- SVG filenames **must match** glyph names exactly (excluding extension).
- Glyphs must already exist in the `.sfd` font—no new glyphs are created.
- SVG files must be well-formed and compatible with FontForge’s importer.
- Bearings are rounded to integers to avoid type errors in Python.

⚙️ Runtime Requirements:
- Python script must be executed using **FontForge’s Python interpreter**, not system Python.
- FontForge must be installed and accessible via `fontforge` or `ffpython`.

📂 File Structure:
- Script file and `.sfd` font must reside in the same directory.
- SVG files should be placed in a subdirectory named:
  "svg-glyphs/plain-svg"

🧪 Example usage (from terminal):
  fontforge -script update-font-with-svg.py
"""
import fontforge
import os

# Set working directory to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Font file path (in the same directory as this script)
font_path = os.path.join(script_dir, "onRouteBC Configurations.sfd")

# SVG folder (relative to this script's location)
svg_folder = os.path.join(script_dir, "svg-glyphs", "plain-svg")

# Open the font
font = fontforge.open(font_path)

# Process each SVG file
for filename in os.listdir(svg_folder):
    if filename.lower().endswith(".svg"):
        glyph_name = os.path.splitext(filename)[0]
        svg_path = os.path.join(svg_folder, filename)

        if glyph_name in font:
            glyph = font[glyph_name]

            # Preserve current bearings
            lbearing = round(glyph.left_side_bearing)
            rbearing = round(glyph.right_side_bearing)

            # Replace glyph outline
            glyph.clear()
            glyph.importOutlines(svg_path, simplify=False)

            # Restore original bearings
            glyph.left_side_bearing = lbearing
            glyph.right_side_bearing = rbearing

            print(f"✔ Replaced glyph: {glyph_name}")
        else:
            print(f"⚠ Glyph '{glyph_name}' not found in font.")

# Save updated font
updated_font_path = os.path.join(script_dir, "onRouteBC Configurations - Updated.sfd")
font.save(updated_font_path)

print("✅ Font update complete!")