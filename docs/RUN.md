# Rodando o projeto

Para rodar essa aplicação localmente você pode seguir uma das três opções descritas a seguir.

Opções:

- [Docker Compose](#docker-compose-recomendada); (Recomendada)
- [Manualmente](#manualmente);
- [Docker run](#docker-run).

## **Docker Compose (Recomendada)**

### **Requisitos**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Docker Compose](https://docs.docker.com/compose/install/) versão 1.29.2 ou superior.

---

### **Desenvolvimento**

Após clonar o projeto e instalar as dependências, execute o seguinte comando para rodar a aplicação:

```sh
docker-compose up
```

> Após os containers subirem, a aplicação estará disponível em [http://localhost:3333/](http://localhost:3333/)

---

### **Produção**

Para executar o projeto em produção, será necessário criar um arquivo ``.env`` na raiz do projeto e preenche-lo, caso seja apenas um teste, basta copiar os valores de ``.env.example``.

```sh
cp .env.example .env

# Ou faça isso manualmente
```

Com o ``.env`` criado e preenchido, rode o seguinte comando:

```sh
docker-compose -f docker-compose.yml up
```

---

## **Manualmente**

### **Requisitos**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Docker Compose](https://docs.docker.com/compose/install/) versão 1.29.2 ou superior;
- [Node.js](https://nodejs.org/) versão 14.17.2 ou superior.
- [Yarn](https://yarnpkg.com/) versão 1.22.10 ou superior.

---

### **Desenvolvimento**

Caso decida rodar manualmente, siga as etapas abaixo:

**Subir container do PostgreSQL:**

```sh
docker-compose up -d database
```

**Subir container do Redis:**

O Redis é opcional, a aplicação funcionará normalmente sem ele, porém não irá se beneficiar da melhoria nos tempos de resposta das requisições que o cache de dados traz.

```sh
docker-compose up -d redis
```

**Instale as dependências:**

```sh
yarn
```

**Run:**

```sh
yarn dev
```

---

### **Produção**

Para executar o projeto em produção, será necessário criar um arquivo ``.env`` na raiz do projeto e preenche-lo, caso seja apenas um teste, basta copiar os valores de ``.env.example``.

```sh
cp .env.example .env

# Ou faça isso manualmente
```

Com o ``.env`` criado e preenchido, siga os seguintes passos:

**Subir container do PostgreSQL:**

```sh
docker-compose -f docker-compose.yml up -d database
```

**Subir container do Redis:**

O Redis é opcional, a aplicação funcionará normalmente sem ele, porém não irá se beneficiar da melhoria nos tempos de resposta das requisições que o cache de dados traz.

```sh
docker-compose -f docker-compose.yml up -d redis
```

**Instale as dependências:**

```sh
yarn
```

**Build:**

```sh
yarn build
```

**Run:**

```sh
yarn start
```

---

## **Docker run**

**Requisitos:**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;

---

**Atenção!** Cada bloco de código possuí duas sessões de comandos ``Desenvolvimento`` e ``Produção``, é importante que a sessão que for escolhida seja executada até o final.

**Criar network:**

Para que os containers possam se comunicar facilmente, iremos criar uma ``network``:

```sh
docker network create goomer-network
```

**Subir container do PostgreSQL:**

```sh
docker run --net goomer-network --name goomerListaRangoDB -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=goomer_lista_rango -p 5432:5432 -v ${PWD}/src/shared/infra/databases/postgreSQL/init.sql:/docker-entrypoint-initdb.d/init.sql -d postgres
```

**Subir container do Redis:**

O Redis é opcional, a aplicação funcionará normalmente sem ele, porém não irá se beneficiar da melhoria nos tempos de resposta das requisições que o cache de dados traz.

```sh
docker run --net goomer-network --name goomerRedis -p 6379:6379 -d redis:alpine
```

**Gerar build da imagem:**

```sh
# Desenvolvimento
docker build -f Dockerfile -t goomer:node .

# Produção
docker build -f Dockerfile.production -t goomer:node .
```

**Run:**

Com a build da imagem já criada, vamos executa-la:

```sh
docker run --net goomer-network -it --rm -v ${PWD}:/app -v /app/node_modules -p 3333:3333 -e REDIS_HOST=goomerRedis -e POSTGRESQL_HOST=goomerListaRangoDB goomer:node
```
