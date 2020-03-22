curl --header "Content-Type: application/json" \
     --request GET \
     --data '{"start_date":"2015-10-01T08:45:10","end_date":"2020-12-12T08:45:10","key_terms":"covid","location": "Paris"}' \
     http://localhost:3000/search