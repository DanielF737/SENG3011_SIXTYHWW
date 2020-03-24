#!/bin/sh

echo "Configuring Files"

# Changes files in API_SourceCode for testing.
sed -i '' 's/database.sqlite/database_static.sqlite/g' ../API_SourceCode/common/db.js
cp database_static.sqlite ../API_SourceCode/database/