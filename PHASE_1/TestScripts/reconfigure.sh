#!/bin/sh

echo "Reconfiguring Files"

# Changes back the files in API_SourceCode for proper use.
sed -i '' 's/database_static.sqlite/database.sqlite/g' ../API_SourceCode/common/db.js
rm ../API_SourceCode/database/database_static.sqlite