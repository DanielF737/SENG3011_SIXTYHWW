# Tests the Get Reports.
curl -X GET "http://localhost:3000/articles?N=0" -H "accept: application/json" > outputs/0.actual
curl -X GET "http://localhost:3000/articles?N=1" -H "accept: application/json" > outputs/1.actual
curl -X GET "http://localhost:3000/articles?N=20" -H "accept: application/json" > outputs/2.actual
curl -X GET "http://localhost:3000/articles?N=30" -H "accept: application/json" > outputs/3.actual
curl -X GET "http://localhost:3000/articles?N=34" -H "accept: application/json" > outputs/4.actual
curl -X GET "http://localhost:3000/articles?N=46" -H "accept: application/json" > outputs/5.actual
curl -X GET "http://localhost:3000/articles?N=50" -H "accept: application/json" > outputs/6.actual
curl -X GET "http://localhost:3000/articles?N=60" -H "accept: application/json" > outputs/7.actual

# Tests the Get Report By ID.
curl -X GET "http://localhost:3000/articles/0" -H "accept: application/json" > outputs/8.actual
curl -X GET "http://localhost:3000/articles/1" -H "accept: application/json" > outputs/9.actual
curl -X GET "http://localhost:3000/articles/5" -H "accept: application/json" > outputs/10.actual
curl -X GET "http://localhost:3000/articles/10" -H "accept: application/json" > outputs/11.actual
curl -X GET "http://localhost:3000/articles/37" -H "accept: application/json" > outputs/12.actual
curl -X GET "http://localhost:3000/articles/49" -H "accept: application/json" > outputs/13.actual
curl -X GET "http://localhost:3000/articles/50" -H "accept: application/json" > outputs/14.actual
curl -X GET "http://localhost:3000/articles/60" -H "accept: application/json" > outputs/15.actual

# Tests the Search Reports
curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"startDate\": \"\", \"endDate\": \"\", \"keyTerms\": [ \"\" ], \"location\": \"\"}" > outputs/16.actual

curl -X POST "http://localhost:3000/search" \
-H "accept: application/json" \
-H "Content-Type: application/json" -d "{ \"startDate\": \"\", \"endDate\": \"\", \"keyTerms\": [ \"\" ], \"location\": \"\"}" > outputs/16.actual

# Tests the Update Article

# Tests the Delete Article