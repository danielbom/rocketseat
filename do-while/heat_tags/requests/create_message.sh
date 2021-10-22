data='''{
  "email": "dani@hotmail.com",
  "message": "My message",
  "username": "dandan"
}'''

curl -s \
  -d "$data" \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:4000/api/message

