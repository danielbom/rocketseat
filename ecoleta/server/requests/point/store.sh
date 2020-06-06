base_url=http://localhost
port=3333
resource=points
url=$base_url:$port/$resource

data='''{
  "point": {
    "name": "Mercado Imperatriz",
    "email": "contato@imperatriz.com.br",
    "whatsapp": "479912312312",
    "latitude": 45.156,
    "longitude": 32.1561,
    "city": "Rio do Sul",
    "uf": "SC"
  },
  "items": [1, 2, 6]
}'''

curl -s -S -# -X POST -H 'content-type: application/json' -d "$data" $url | jq
echo ""