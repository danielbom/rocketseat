

- Comandos:
  mkdir backend
  cd backend
  yarn init -y

  yarn add express    # Server base
  mkdir src
  touch src/server.js
  yarn add nodemon -D # Listener changes and update

  touch src/routes.js

  yarn add mongoose   # Object Document Mapping (ODM) worker
  yarn add multer     # Multipart form request sender

  yarn add cors


- Configurando docker
  docker create --name rocketseat --publish 27017:27017 mongo
  docker container start rocketseat

- Configurando o mongodb (mongodb://adminAircnc:123mudar@localhost:27017/aircnc)
  use aircnc
  db.createUser({
    user: "adminAircnc",
    pwd: "123mudar",
    roles: [ { role: "readWrite", db: "aircnc" } ]
  })

- Dicas
  Faz uma análise da porta usada
  http://portquiz.net:(port)/