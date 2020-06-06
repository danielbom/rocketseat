base_url=http://localhost
port=3333
resource=points
url=$base_url:$port/$resource

id=3

curl -s -S -# -X DELETE -H 'content-type: application/json' $url/$id | jq
echo ""
