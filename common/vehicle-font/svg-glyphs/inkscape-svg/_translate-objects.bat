:: translate-objects.bat
::
:: This batch file uses Inkscape's command-line interface to apply a scale of 175%
:: and a vertical translation of -150 pixels (i.e., 150 pixels upward) to the grouped
:: object in each .svg file within the current directory.
::
:: Requirements:
:: - Each .svg file must contain exactly one grouped object inside a single layer.
:: - The group ID must be normalized to "g1" using the normalize-group-ids.py script
::   (or equivalent) prior to running this command.
::
:: Use Case:
:: This is useful for batch transformations such as aligning, shifting, or positioning
:: multiple glyphs or illustrations. The command ensures consistent placement for design
:: tasks like font preparation, layout systems, or exported icon grids.
::
:: Notes:
:: - Inkscape must be installed and its executable path correctly specified or added to the system PATH.
:: - This script overwrites each original .svg file after transformation (so make backups
::   prior to running this script).
@echo off

echo Scaling and moving grouped object in each SVG...
for %%f in (*.svg) do (
    "C:\Program Files\Inkscape\bin\inkscape.com" "%%f" --select=g1 --actions="transform-scale:1.75,1.75; transform-translate:0,-150;export-overwrite" --export-filename="%%f"
)

echo Done!
pause