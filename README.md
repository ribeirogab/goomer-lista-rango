<h1 align="center">
  <img src="https://i.ibb.co/YPChnDc/Lista-Rango-2.png" alt="Goomer Lista Rango API" width="260"/>
</h1>

# 🍴 Goomer Lista Rango API 🍴

> API RESTful capaz de gerenciar os restaurantes e os produtos do seu cardápio.

- [Tecnologias](#Tecnologias)
- [Desafios](#Desafios)
- [Melhorias](#Melhorias)
- [Arquitetura](#Arquitetura)
- [Instalação](#Instalação)
- [Testes](#Testes)

**Demo:** https://goomer-lista-rango.ribeirogab.me

# Tecnologias

Linguagens e ferramentas:

- [Node.js](https://nodejs.org/);
- [TypeScript](https://www.typescriptlang.org/).

Banco de Dados:

- [PostgreSQL](https://www.postgresql.org/);

Testes unitários:

- [Jest](https://jestjs.io/).

Cache:

- [Redis](https://redis.io/).

Padronização de código/commits:

- [ESLint](https://eslint.org/);
- [Prettier](https://prettier.io/);
- [Commitizen](https://github.com/commitizen/cz-cli).

Ambiente

- [Docker](https://docs.docker.com/);
- [Docker Compose](https://docs.docker.com/compose/).

# Desafios

Trabalhar sem ter um ``ORM``. Ter que relembrar e escrever SQL puro, aprender como fazer agregações no PostgreSQL e criar uma arquitetura própria de relação entre as ``entities`` do projeto com certeza foi o maior desafio.

Outro desafio foi escrever primeiramente todos os testes unitários da aplicação com os repositórios fakes para somente após isso criar e implementar os repositórios do PostgreSQL. Está decisão foi tomada pelo fato de ter que criar toda a lógica no SQL manualmente, implementar essas lógicas primeiramente nos testes ajudaram bastante na criação dos repositórios do PostgreSQL.

# Melhorias

**Testes de integração:**

Os testes de integração são mais que necessários nesta e em qualquer aplicação que visa escalabilidade e confiabilidade.

---

**Tabela de indisponibilidade:**

Criar uma tabela de indisponibilidade no banco de dados para que os restaurantes consigam cadastrar um horário que estarão ausentes. Por exemplo:

Um restaurante trabalha das 11:00 às 17:00 de segunda à sexta, porém, em uma semana específica ele funcionará das 11:00 às 15:00 na segunda-feira (os outros dias continuam normais), por conta de algum compromisso/imprevisto ou qualquer outra coisa. Tendo uma tabela de indisponibilidade, o restaurante poderá cadastrar exatamente o período que estará indisponível, sem precisar alterar o seu horário de trabalho fixo.

---

**Implementar um ORM:**

Apesar da aplicação estar relativamente organizada, um ``ORM`` seria de grande ajuda principalmente para deixar o código mais legível e manutenível, retirando toda a complexidade do SQL do repositório.

Opções de ORM:

- Sequelize;
- TypeORM.

---

**API de códigos postais:**

Atualmente a API possui um ``provider`` de código postais com duas implementações:

- Brasil API;
- Postmon.

Porém essas APIs fornecem apenas códigos postais (CEP) do Brasil, sendo assim, a aplicação ficaria limitada a somente o Brasil. (dependendo do objetivo da aplicação isso não é um problema)

Possíveis soluções:

- Habilitar todos os campos de endereço diretamente na rota;
- Utilizar uma API de códigos postais global.

---

**API KEY:**

Como a API não tem nenhuma forma de autenticação e todas as rotas são públicas, uma boa solução seria criar uma API KEY para cada client que utilizasse-a.

---

**Excluir promoção quando acabar:**

Quando um produto é colocado em promoção temos a data/hora de início e término, sendo assim, após o fim da promoção o registro poderia ser excluído do banco de dados e o campo de promoção na listagem de produtos ser setado como ``null``.

---

# Arquitetura

O projeto foi construído em cima da arquitetura Domain-Driven Design ou Projeto Orientado a Domínio (famoso DDD) que é um padrão de modelagem orientado a objetos (módulos).

## Arquitetura global

```shell
src/
|-- config/ # Contém os arquivos de configuração, exemplo: dotenv, cache e upload.
|-- modules/ # Contém os módulos (ou objetos) da aplicação.
|-- shared/ # Arquivos compartilhados (globais), exemplo: server, errors e container de injeção de dependência.
|-- swagger.json # Apenas a documentação
```

## Arquitetura dos módulos

```shell
{module}/
|-- infra/ # Contém as rotas, controllers e implementações de repositórios
|-- models/ # Contém o modelo (ou estrutura) de dados do módulo
|-- providers/ # Arquivos dos repositórios e providers do módulo para serem "injetados" no container de injeção de dependência
|-- repositories/ # Modelo de dados, DTOs e fakes dos repositórios do módulo
|-- services/ # Serviços ou regra de negócio da aplicação
```

# Banco de dados

O banco de dados utilizado no projeto foi o PostgreSQL, mais por questão de familiaridade do que alguma outra razão específica.

**Modelo (DER):**

<img src="https://i.ibb.co/4mFyy6f/Goomer-Lista-Rango-2x-8.png" alt="DER" width="800"/>

- [SQL de criação do banco](https://github.com/ribeirogab/goomer-lista-rango/blob/main/src/shared/infra/databases/postgreSQL/init.sql)

# Instalação

```sh
git clone https://github.com/ribeirogab/goomer-lista-rango
```

```sh
cd goomer-lista-rango
```

```sh
yarn
```

## Rodando o projeto

Para rodar essa aplicação localmente você pode seguir uma das três opções descritas a seguir.

Opções:

- [Docker Compose](#docker-compose-recomendada); (Recomendada)
- Manualmente;
- Docker run.

## Docker Compose (Recomendada)

**Requisitos:**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Docker Compose](https://docs.docker.com/compose/install/) versão 1.29.2 ou superior.

---

**Desenvolvimento:**

Após clonar o projeto e instalar as dependências, execute o seguinte comando para rodar a aplicação:

```sh
docker-compose up
```

> Após os containers subirem, a aplicação estará disponível em [http://localhost:3333/](http://localhost:3333/)

---

**Production ready:**

Para executar o projeto em produção, será necessário criar um arquivo ``.env`` na raiz do projeto e preenche-lo, caso seja apenas um teste, basta copiar os valores de ``.env.dev``.

Com o ``.env`` criado e preenchido, rode o seguinte comando:

```sh
docker-compose -f docker-compose.yml up
```

## Manualmente

**Requisitos:**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Node.js](https://nodejs.org/) versão 14.17.2 ou superior.
- [Yarn](https://yarnpkg.com/) versão 1.22.10 ou superior.

## Docker run

**Requisitos:**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;

# Testes

## Testes unitários

Com a aplicação clonada e as dependências instaladas, para rodar os testes unitários execute o seguinte comando:

```sh
yarn test
```

**Cobertura:**

<img src="https://i.ibb.co/Mpn9mVj/Screenshot-20210719-153306.png" alt="Cobertura dos testes" width="480"/>

Para visualizar a cobertura dos testes de uma maneira mais intuítiva, acesse o diretório ``goomer-lista-rango/coverage/lcov-report``.

Esta pasta possuí um arquivo ``ìndex.html``, que ao ser aberto exibirá a cobertura de todos os testes.
