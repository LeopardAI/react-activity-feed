#!/bin/bash

# Find all test files that import from @testing-library/react
grep -l "import.*from '@testing-library/react'" $(find src -name "*.test.tsx") | while read file; do
  echo "Updating $file"
  # Replace the import with our custom test utilities
  sed -i '' "s/import { \(.*\) } from '@testing-library\/react';/import { \1 } from '..\/utils\/test-utils';/g" "$file"
  # If the file is in a subdirectory, adjust the relative path
  depth=$(echo "$file" | grep -o '/' | wc -l)
  if [ "$depth" -gt 2 ]; then
    # Add one more '../' for each additional directory level
    additional_levels=$((depth - 2))
    sed -i '' "s/import { \(.*\) } from '..\/utils\/test-utils';/import { \1 } from '..$(printf '/..' %.0s $(seq 1 $additional_levels))\/utils\/test-utils';/g" "$file"
  fi
done

echo "All test files have been updated!" 