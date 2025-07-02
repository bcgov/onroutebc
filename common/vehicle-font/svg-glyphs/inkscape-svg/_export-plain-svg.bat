:: export-plain-svg.bat
::
:: This batch file exports all Inkscape-generated .svg files in the current directory
:: to Plain SVG format using Inkscape's command-line interface. The exported files
:: are saved into a sibling directory named "..\plain-svg" with the same base filenames.
::
:: Why this matters:
:: Inkscape SVGs retain Inkscape-specific features like guides, grids, layers, and metadata
:: that are not part of the standard SVG specification. This is useful for continued editing.
:: However, for workflows like font development (e.g., importing glyphs into FontForge),
:: Plain SVG format is required to ensure clean, portable geometry with no extra data.
::
:: Behavior:
:: - Creates the "..\plain-svg" folder if it doesn’t already exist.
:: - Overwrites existing files in the output folder without prompting.
:: - Preserves original filenames.
::
:: Notes:
:: - Make sure the input files are finalized and grouped appropriately before export.
:: - Inkscape must be installed and callable from the specified path or system PATH.
@echo off
if not exist "..\plain-svg" mkdir "..\plain-svg"

echo Exporting Plain SVG copies...
for %%f in (*.svg) do (
    "C:\Program Files\Inkscape\bin\inkscape.com" "%%f" --actions="export-filename:..\plain-svg\%%~nxf;export-plain-svg;export-do"
)

echo Done!
pause