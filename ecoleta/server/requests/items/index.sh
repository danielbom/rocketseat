base_url=http://localhost
port=3333
resource=items
url=$base_url:$port/$resource

curl -s -S -# -X GET -H 'content-type: application/json' $url | jq
echo ""