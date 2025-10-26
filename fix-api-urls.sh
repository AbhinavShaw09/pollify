#!/bin/bash

# Add API import to all files that use localhost:8000
files=$(grep -r "localhost:8000" frontend/app frontend/components --include="*.tsx" --include="*.ts" -l)

for file in $files; do
    # Add import if not already present
    if ! grep -q "API_BASE_URL" "$file"; then
        # Find the last import line and add after it
        sed -i '' '/^import.*from/a\
import { API_BASE_URL } from "@/lib/api"
' "$file"
    fi
    
    # Replace localhost:8000 with API_BASE_URL
    sed -i '' 's|http://localhost:8000|\${API_BASE_URL}|g' "$file"
done

echo "Fixed API URLs in all files"
