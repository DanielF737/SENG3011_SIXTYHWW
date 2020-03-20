#!/bin/sh

echo "Getting Data"

c=0

# Tests the Get Reports.
curl -X GET "http://localhost:3000/articles?N=0" -H "accept: application/json" > outputs/$c.actual
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=1" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=20" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=30" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=34" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=46" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=50" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles?N=60" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`

# Tests the Get Report By ID.
curl -X GET "http://localhost:3000/articles/0" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/1" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/5" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/10" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/37" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/49" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/50" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`
curl -X GET "http://localhost:3000/articles/60" -H "accept: application/json" > outputs/$c.actual 
c=`expr $c + 1`

# Tests the Search Reports
curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"startDate\": \"\", \"endDate\": \"\", \"keyTerms\": [ \"\" ], \"location\": \"\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"startDate\": \"\", \"endDate\": \"\", \"keyTerms\": [ \"\" ], \"location\": \"\"}" > outputs/$c.actual 
c=`expr $c + 1`


# Tests the Update Article

# Tests the Delete Article

# Gets differences for all files.