base_url=http://localhost
port=3333
resource=points
url=$base_url:$port/$resource

id=2

url=$url/$id/upload

curl -s -F image=@`pwd``dirname "$0" | tr -d .`/image.jpg $url | jq
# curl -s -X POST $url | jq