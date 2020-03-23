#!/bin/sh

echo "Getting Data"

c=0

echo "Getting reports, c = $c"
# Gets data for Get Reports.
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

echo "Getting reports by ID, c = $c"
# Gets data for Get Report By ID.
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

echo "Getting search reports, c = $c"
# Gets data for Search Reports
curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"\", \"end_date\": \"\", \"keyTerms\": \"\", \"location\": \"\"}" > outputs/$c.actual
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2020-04-20T12:00:00\", \"end_date\": \"\", \"keyTerms\": \"\", \"location\": \"\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"\", \"end_date\": \"2020-04-20T12:00:00\", \"keyTerms\": \"\", \"location\": \"\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"\", \"end_date\": \"\", \"keyTerms\": \"COVID-19\", \"location\": \"\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"\", \"end_date\": \"\", \"keyTerms\": \"\", \"location\": \"Sydney\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"12:00:00 1999-09-09\", \"end_date\": \"2020-04-20T12:00:00\", \"keyTerms\": \"COVID-19\", \"location\": \"New York\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"2021-10-12T10:47:12\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"2021-10-12T10:47:12\", \"location\": \"United States\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"12:00:00 2020-06-10\", \"keyTerms\": \"COVID-19\", \"location\": \"New York\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2020-06-10T12:00:00\", \"end_date\": \"2020-04-20T12:00:00\", \"keyTerms\": \"COVID-19\", \"location\": \"New York\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"1999-09-09T12:00:00\", \"end_date\": \"2000-09-09T12:00:00\", \"keyTerms\": \"COVID-19\", \"location\": \"New York\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2020-01-01T12:00:00\", \"end_date\": \"2020-04-04T12:00:00\", \"keyTerms\": \"COVID-19\", \"location\": \"Pineapple\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2020-01-01T12:00:00\", \"end_date\": \"2020-04-04T12:00:00\", \"keyTerms\": \"Orange\", \"location\": \"New York\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2020-01-01T12:00:00\", \"end_date\": \"2020-04-04T12:00:00\", \"keyTerms\": \"COVID-19, other\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"2021-10-12T10:47:12\", \"keyTerms\": \"COVID-19\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"2021-10-12T10:47:12\", \"keyTerms\": \"\", \"location\": \"Argentina\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"2021-10-12T10:47:12\", \"keyTerms\": \"COVID-19\", \"location\": \"Italy\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2019-01-01T12:00:00\", \"end_date\": \"2019-01-01T12:01:01\", \"keyTerms\": \"Influenza\", \"location\": \"Hobart\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2018-09-19T09:12:43\", \"end_date\": \"2021-10-12T10:47:12\", \"keyTerms\": \"other\", \"location\": \"China\"}" > outputs/$c.actual 
c=`expr $c + 1`

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"start_date\": \"2019-12-01T11:01:01\", \"end_date\": \"2020-04-04T12:01:01\", \"keyTerms\": \"COVID-19\", \"location\": \"London\"}" > outputs/$c.actual 
c=`expr $c + 1`

# Tests the Update Article

# Tests the Delete Article

# Gets differences for all files.