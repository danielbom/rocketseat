base_url=http://localhost
port=3333
resource=points
url=$base_url:$port/$resource

city='Campo Mourão'
uf="PR"
items="1,2,3,4,5,6"

echo $url city=$city uf=$uf items=$items
curl -s -S -# -G -X GET -H 'content-type: application/json' $url \
  --data-urlencode "city=$city" \
  --data-urlencode "uf=$uf" \
  --data-urlencode "items=$items" \
   | jq
echo ""