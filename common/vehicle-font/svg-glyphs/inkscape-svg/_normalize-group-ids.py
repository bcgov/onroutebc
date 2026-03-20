"""
normalize_group_ids.py

This script processes a batch of Inkscape-generated SVG files in the current directory.
Each file is assumed to contain a single meaningful group of vector elements, encapsulated
within an Inkscape layer structure. The script identifies the second <g> (group) element in
each SVG and standardizes its ID attribute to "g1".

Why this script exists:
-----------------------
Inkscape assigns random, unique IDs to grouped objects when a user creates a group
within the graphical interface (e.g., "g33465", "g12482", etc.). This randomness makes
it impractical to automate operations using Inkscape’s command-line interface, which
requires a known and stable ID to target objects for transformation (like translation,
scaling, or exporting).

Since all SVG files in this use case contain a single grouped object inside one layer,
we can safely assume that:
  1. The first <g> element represents the Inkscape layer itself (commonly "layer1").
  2. The second <g> element — a child of the first — is the actual grouped object we
     want to modify across all SVGs.

What the script does:
---------------------
- Iterates over all .svg files in the current directory.
- Loads each file using ElementTree and parses the XML.
- Finds all <g> elements in the SVG namespace.
- Selects the second <g> element (index 1), which is presumed to be the only grouped object.
- Renames its "id" attribute to "g1".
- Overwrites the original SVG file with the modified XML.

Why this is considered safe:
----------------------------
- The grouped object is the only semantic content in each SVG file, so renaming its ID does
  not interfere with other elements or internal references.
- Since Inkscape typically assigns these IDs randomly and they aren't used elsewhere in the
  file (e.g., via <use> tags or CSS), normalization does not break dependencies.
- The file structure (only one layer, one group) is assumed for the input files, and the 
  script gracefully skips files that have fewer than 2 groups.

If the file structure changes (e.g., additional groups or layers are added), this script may
need to be revised to accurately target the intended object.

Author: John Fletcher
Created: June 27, 2025
"""

import os
import xml.etree.ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace('', SVG_NS)

for filename in os.listdir("."):
    if filename.endswith(".svg"):
        tree = ET.parse(filename)
        root = tree.getroot()

        # Find all group elements with the SVG namespace
        groups = root.findall(f".//{{{SVG_NS}}}g")

        if len(groups) >= 2:
            # Update the second <g> element, not the layer
            target_group = groups[1]
            target_group.set("id", "g1")
            tree.write(filename, encoding="utf-8", xml_declaration=True)
            print(f"Updated '{filename}'")
        else:
            print(f"Skipping '{filename}': not enough <g> elements.")