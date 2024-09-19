```bash
go mod init server

# Migration Tool
go install github.com/jackc/tern/v2@latest

# Migrations
mkdir internal/store/pgstore/
tern init ./internal/store/pgstore/migrations
tern new --migrations ./internal/store/pgstore/migrations create_rooms_table
tern new --migrations ./internal/store/pgstore/migrations create_messages_table

# Cmd
touch cmd/tools/terndotenv/main.go
go get github.com/joho/godotenv

# Run migrations
go run cmd/tools/terndotenv/main.go

# Sql to code: Linux
go get github.com/sqlc-dev/sqlc/cmd/sqlc@latest
sqlc generate -f ./internal/store/pgstore/sqlc.yaml

# Sql to code: Windows
docker run --rm -v ".:/src" -w /src kjconroy/sqlc generate -f "./internal/store/pgstore/sqlc.yaml"

# Fix missing modules
go mod tidy

# Running ./gen.go and **/gen.go
go generate ./...

# Running the server
go run cmd/wsrs/main.go
```
