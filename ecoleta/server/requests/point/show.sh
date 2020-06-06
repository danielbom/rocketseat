base_url=http://localhost
port=3333
resource=points
url=$base_url:$port/$resource

id=2

curl -s -S -# -X GET -H 'content-type: application/json' $url/$id | jq
echo ""