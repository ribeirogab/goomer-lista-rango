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

Com o ``.env`` criado e preenchido, rode o seguinte comando:

```sh
docker-compose -f docker-compose.yml up
```

---

## Manualmente

### **Requisitos**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Docker Compose](https://docs.docker.com/compose/install/) versão 1.29.2 ou superior;
- [Node.js](https://nodejs.org/) versão 14.17.2 ou superior.
- [Yarn](https://yarnpkg.com/) versão 1.22.10 ou superior.

---

### **Desenvolvimento**

Caso decida rodar manualmente, siga as etapas abaixo:

```sh
docker-compose up database -d
```

```sh
# opcional

docker-compose up redis -d
```

```sh
yarn dev
```

---

### **Produção**

Para executar o projeto manualmente em produção, execute os comandos abaixo:

```sh
cp .env.example .env

# ou faça isso manualmente
```

```sh
docker-compose -f docker-compose.yml up database -d
```

```sh
# opcional

docker-compose -f docker-compose.yml up redis -d
```

```sh
yarn build
```

```sh
yarn start
```

---

## Docker run

**Requisitos:**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
