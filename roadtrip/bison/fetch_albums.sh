#!/bin/bash

# Initialize cache file
echo "// Auto-generated cache file $(date)" > src/data/api/cache.25.7.8.js
echo "export default {" >> src/data/api/cache.25.7.8.js

# Array of album IDs and names
albums=(
  "MLqTy:Acadia"
  "OeKcu:Shenandoah"
  "HEb43:Congaree"
  "kAugO:Great_Smoky_Mountains"
  "d4qXm:Mammoth_Cave"
  "S0PY5:Cuyahoga_Valley"
  "HvCk2:Isle_Royale"
  "kYbQv:Badlands"
  "unoxC:Yellowstone"
  "5qxGd:Glacier"
  "jDs2f:Big_Bend"
  "c3gOs:Hot_Springs"
  "gAspd:Redwood"
  "5RQFv:Olympic"
  "4Ql9s:Mt_Rainier"
  "k13am:Crater_Lake"
  "LfIO4:Lassen_Volcanic"
  "FNgV0:Yosemite"
  "BNE0q:Channel_Islands"
  "vCMn9:Joshua_Tree"
  "i1hQc:Grand_Canyon"
  "k2OSn:Zion"
  "i0L3L:Bryce_Canyon"
  "YjEQ8:Capitol_Reef"
  "MMgqW:Arches"
  "OCflx:Canyonlands"
  "3GJZQ:Mesa_Verde"
  "VVFTf:Great_Sand_Dunes"
  "J75hd:Carlsbad_Caverns"
  "NsUnY:Rocky_Mountain"
  "GC2fd:Guadalupe_Mountains"
  "fcojTUy:Indiana_Dunes"
  "rcqFNIh:Wind_Cave"
  "SmKzRoG:Theodore_Roosevelt"
  "sAU3k5b:Voyageurs"
  "6Y3XxLK:New_River_Gorge"
)

# Fetch each album
for album in "${albums[@]}"; do
  IFS=':' read -r album_id park_name <<< "$album"
  echo "Fetching $park_name ($album_id)..."
  
  # Make API call and capture response
  response=$(curl -s -H "Authorization: Client-ID 27a13f9320a8875" "https://api.imgur.com/3/album/$album_id")
  
  # Check if response is valid JSON
  if echo "$response" | jq . >/dev/null 2>&1; then
    echo "  \"$album_id\": $response," >> src/data/api/cache.25.7.8.js
  else
    echo "Error fetching $park_name ($album_id)"
  fi
  
  # Small delay to be nice to the API
  sleep 0.5
done

# Close the object and remove trailing comma
sed -i '' '$s/,$//' src/data/api/cache.25.7.8.js
echo "};" >> src/data/api/cache.25.7.8.js

echo "Cache file created successfully!"
