# 🚀 Backend - Desafio Técnico WeFit

[![CI Pipeline](https://github.com/rafittu/back-wefit/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/rafittu/back-wefit/actions/workflows/ci.yml)
[![Docker Build](https://github.com/rafittu/back-wefit/actions/workflows/docker.yml/badge.svg?branch=develop)](https://github.com/rafittu/back-wefit/actions/workflows/docker.yml)

###

<br>

Este projeto é uma API desenvolvida como parte do **Desafio Técnico Backend da WeFit**, implementando um sistema de autenticação JWT e criação de perfis de usuário com validação de endereço brasileiro através da API ViaCEP.

A aplicação demonstra boas práticas de engenharia de software, arquitetura modular, validações robustas, tratamento de erros, testes unitários com 100% de cobertura e documentação completa via Swagger/OpenAPI.

<br>

## 🛠️ Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Node.js** com framework **NestJS** e **TypeScript**;
- **Prisma ORM** para comunicação e manipulação do banco de dados **MySQL**;
- **Docker** e **Docker Compose** para containerização do banco de dados;

- **Passport.js** para implementação de estratégias de autenticação;
- **JWT** para autenticação e autorização de acesso;
- **Bcrypt** para criptografia de senhas;

- **Axios** para integração com APIs externas (ViaCEP);
- **Class Validator** e **Class Transformer** para validação de DTOs;
- **Jest** para execução e automação dos testes unitários;
- **Swagger/OpenAPI** para documentação interativa da API;

<br>

## ⚙️ Funcionalidades

### Autenticação:
- Login com email e senha gerando token JWT;
- Endpoint protegido para obter informações do usuário autenticado;
- Sistema de guards (JWT e Local) para proteção de rotas;
- Decorador `@IsPublic()` para rotas públicas;

### Gerenciamento de Perfis:
- Criação de perfil de usuário com dados pessoais e endereço;
- Validação de **CPF** e **CNPJ** com algoritmo de dígitos verificadores;
- Validação de formato de telefone celular e fixo brasileiro;
- Integração com **API ViaCEP** para validação automática de endereço;
- Verificação de correspondência entre CEP informado e cidade/estado;

### Validações e Tratamento de Erros:
- Validação de unicidade de email, CPF, CNPJ e celular;
- Tratamento personalizado de erros do Prisma (unique constraints);
- Mensagens de erro descritivas e códigos HTTP apropriados;
- Sistema centralizado de erros com `AppError`;

### Pipeline automatizado de CI/CD com GitHub Actions:
- **Testes Automatizados:** Todos os testes unitários são executados em cada PR
- **Validação de Lint:** Code style é verificado automaticamente
- **Docker Build:** Validação de containerização em cada mudança
- **Branch Protection:** Merge bloqueado se testes falharem

<br>

## 📋 Observação sobre Implementação

Este projeto foi implementado com **NestJS + TypeScript** (arquitetura modular, DTOs, pipes, guards e Dependency Injection) visando boas práticas de engenharia de software e facilitar evolução, manutenção e testes:

- ✅ **Arquitetura escalável** com módulos bem definidos;
- ✅ **Injeção de dependências** nativa;
- ✅ **Validação automática** via pipes e decorators;
- ✅ **Documentação automática** com Swagger/OpenAPI integrado;
- ✅ **Testabilidade** facilitada com mocks e DI;
- ✅ **TypeScript** para type safety e melhor DX;

Para iniciar o projeto, siga o guia de configuração abaixo. O comando `npm start` inicia a aplicação NestJS normalmente.

<br>

## 🔧 Configuração do Projeto

### Requisitos

- **Node.js** (versão 18.x ou superior);
- **Docker** e **Docker Compose**;
- **npm** ou **yarn**;

<br>

### Instalação

1. **Clone o repositório:**

```bash
$ git clone git@github.com:rafittu/back-wefit.git
$ cd back-wefit
```

2. **Instale as dependências:**

```bash
$ npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto e preencha as informações de acordo com o arquivo `.env.example` disponível:

```env
# APP PORT
PORT=3008

# CORS
CORS_ORIGINS=http://localhost:3000

# DATABASE
MYSQLDB_PASSWORD=password
MYSQLDB_PORT=3306
MYSQLDB_DATABASE=wefit

DATABASE_URL='mysql://user:password@localhost:3306/wefit'

# JWT
JWT_SECRET='WeFit#SuperSecret'
JWT_EXPIRATION_TIME='27d'
```

4. **Inicie o banco de dados:**

```bash
$ docker compose up -d
```

O Docker Compose criará um container MySQL acessível em `localhost:3306` com usuário `user` e senha `password`.

5. **Execute as migrations do Prisma:**

```bash
$ npx prisma migrate dev
```

6. **Inicie a aplicação:**

```bash
# Modo desenvolvimento
$ npm start

# Modo watch (recarrega automaticamente)
$ npm run start:dev

# Modo produção
$ npm run start:prod
```

A API estará disponível em `http://localhost:3008` (ou porta configurada no `.env`).

<br>

### 🐳 Alternativa: Executar com Docker (Opcional)

Para rodar a aplicação **e** o banco de dados juntos em containers:

```bash
# Iniciar containers (app + MySQL)
$ docker compose -f docker-compose.dev.yml up --build

# Rodar em background
$ docker compose -f docker-compose.dev.yml up -d --build

# Parar containers
$ docker compose -f docker-compose.dev.yml down
```

**Observações:**
- ✅ Prisma Client é gerado automaticamente
- ✅ Migrations são aplicadas no startup
- ✅ Hot-reload funciona (volumes montados)
- ✅ MySQL usa variáveis do `.env`

<br>

## 📡 Endpoints Principais

### Autenticação (Pública):

- **`POST /login`:** Autenticar usuário e receber token JWT;
  
  **Corpo da requisição:**
  ```json
  {
    "email": "user1@example.com",
    "password": "Password123!"
  }
  ```
  
  **Resposta:**
  ```json
  {
    "error": {
      "status": false,
      "message": null,
      "code": null
    },
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

  > **Nota:** O `accessToken` retornado deve ser utilizado no campo `Authorization` no formato `Bearer {accessToken}` no cabeçalho das requisições protegidas.

<br>

### Autenticação (Protegida):

- **`GET /me`:** Obter informações do usuário autenticado;
  
  **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
  
  **Resposta:**
  ```json
  {
    "error": {
      "status": false,
      "message": null,
      "code": null
    },
    "data": {
      "id": "1",
      "name": "User One",
      "email": "user1@example.com"
    }
  }
  ```

<br>

### Perfil de Usuário (Protegida):

- **`POST /profile/create`:** Criar um novo perfil de usuário;
  
  **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
  
  **Corpo da requisição:**
  ```json
  {
    "cpf": "52998224725",
    "name": "João Silva",
    "cellphone": "11999887766",
    "phone": "1133334444",
    "email": "joao.silva@example.com",
    "emailConfirmation": "joao.silva@example.com",
    "zipCode": "01001000",
    "street": "Praça da Sé",
    "number": "100",
    "complement": "Lado ímpar",
    "city": "São Paulo",
    "neighborhood": "Sé",
    "state": "SP"
  }
  ```
  
  **Resposta (201 - Created):**
  ```json
  {
    "error": {
      "status": false,
      "message": null,
      "code": null
    },
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "cpf": "52998224725",
      "cnpj": null,
      "name": "João Silva",
      "cellphone": "11999887766",
      "phone": "1133334444",
      "email": "joao.silva@example.com",
      "createdAt": "2025-10-17T14:30:00.000Z",
      "updatedAt": "2025-10-17T14:30:00.000Z",
      "address": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "profileId": "550e8400-e29b-41d4-a716-446655440000",
        "zipcode": "01001000",
        "street": "Praça da Sé",
        "number": "100",
        "complement": "Lado ímpar",
        "neighborhood": "Sé",
        "city": "São Paulo",
        "state": "SP",
        "createdAt": "2025-10-17T14:30:00.000Z",
        "updatedAt": "2025-10-17T14:30:00.000Z"
      }
    }
  }
  ```

<br>

### Respostas de Erro

Todos os endpoints retornam erros no seguinte formato:

```json
{
  "internalCode": "profile-service.createProfile",
  "code": 400,
  "message": "provided CPF is invalid."
}
```

**Códigos HTTP:**
- `400` - Validação falhou (documento inválido, campos obrigatórios, etc.)
- `401` - Não autenticado ou token inválido
- `409` - Conflito (email, CPF, CNPJ ou celular já cadastrado)
- `500` - Erro interno do servidor

<br>

## 🧪 Testes

A API possui uma cobertura de testes unitários abrangente, com **100% de cobertura** em cada parte essencial do código, garantindo a qualidade e o correto funcionamento do sistema.

### Executar todos os testes:

```bash
$ npm run test
```

### Gerar relatório de cobertura:

```bash
$ npm run test:cov
```

### Resultado esperado:

```
Test Suites: 3 passed, 3 total
Tests:       34 passed, 34 total
Snapshots:   0 total

--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
profile.controller  |   100   |   100    |   100   |   100   |
profile.service     |   100   |  81.57   |   100   |   100   |
profile.repository  |   100   |   100    |   100   |   100   |
--------------------|---------|----------|---------|---------|
```

<br>

## 📚 Documentação

A documentação completa da API está disponível através do **Swagger UI**. Para acessá-la:

1. Certifique-se de ter a API em execução;
2. Abra um navegador e acesse: `http://localhost:3008/v1/api-doc` (substitua `3008` pela porta configurada no `.env`);
3. A documentação interativa será exibida, permitindo:
   - Explorar todos os endpoints disponíveis;
   - Visualizar schemas de request/response;
   - Testar endpoints diretamente pelo navegador;
   - Autenticar usando o botão "Authorize" com o token JWT;

### Como testar no Swagger:

1. Execute `POST /login` com as credenciais de teste (ex: `user1@example.com / Password123!`);
2. Copie o `accessToken` retornado;
3. Clique no botão "Authorize" (cadeado verde) no topo da página;
4. Cole o token e clique em "Authorize";
5. Agora você pode testar os endpoints protegidos (`GET /me` e `POST /profile/create`);

<br>

## 🗂️ Estrutura do Projeto

```
back-auth/
├── prisma/
│   ├── migrations/          # Histórico de migrations do Prisma
│   └── schema.prisma        # Schema do banco de dados
├── src/
│   ├── common/              # Recursos compartilhados
│   │   ├── decorators/      # Decorators customizados
│   │   ├── errors/          # Sistema de erros customizado
│   │   ├── filter/          # Exception filters
│   │   └── interceptors/    # Response interceptor
│   ├── modules/
│   │   ├── auth/            # Módulo de autenticação
│   │   │   ├── guards/      # JWT e Local guards
│   │   │   ├── strategies/  # Passport strategies
│   │   │   └── services/    # Lógica de autenticação
│   │   └── profile/         # Módulo de perfil
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── interfaces/  # Interfaces TypeScript
│   │       ├── repository/  # Camada de dados
│   │       ├── services/    # Lógica de negócio
│   │       └── test/        # Testes unitários
│   ├── utils/               # Validadores (CPF, CNPJ)
│   ├── app.module.ts        # Módulo raiz
│   ├── main.ts              # Entry point
│   └── prisma.service.ts    # Serviço Prisma
├── swagger.json             # Documentação OpenAPI 3.0
├── docker-compose.yml       # Configuração Docker
└── README.md
```

<br>

## 🔐 Usuários de Teste (Mock)

A autenticação atualmente utiliza usuários mock definidos em `src/modules/auth/mocks/auth.mock.ts`:

| Email | Senha | Nome |
|-------|-------|------|
| user1@example.com | Password123! | User One |
| user2@example.com | Secret456$ | User Two |
| user3@example.com | HelloWorld789# | User Three |

> **Nota:** A integração com banco de dados para autenticação pode ser implementada em versões futuras.

<br>

## 🚀 Decisões Técnicas

### Por que NestJS?

- **Arquitetura modular e escalável** similar a frameworks enterprise (Spring Boot);
- **Dependency Injection** nativa facilita testes e manutenção;
- **Decorators** para validação automática e redução de boilerplate;
- **TypeScript first** com type safety end-to-end;
- **Ecossistema maduro** com guards, pipes, interceptors, filters;
- **Documentação automática** com Swagger/OpenAPI integrado;
- **Alinhamento com requisitos da vaga:** boas práticas, código limpo, testável e escalável;

### Estrutura em Camadas:

- **Controller:** Recebe requisições HTTP, delega para services
- **Service:** Lógica de negócio e orquestração
- **Repository:** Acesso a dados (Prisma)
- **DTOs:** Validação de entrada com class-validator
- **Interfaces:** Contratos TypeScript para type safety

### Tratamento de Erros:

- **AppError customizado** com código interno para debugging
- **HttpExceptionFilter** para padronização de respostas de erro
- **Prisma error handling** para erros de banco de dados

<br>

##

<p align="right">
  <a href="https://www.linkedin.com/in/rafittu/">Rafael Ribeiro 🚀</a>
</p>
