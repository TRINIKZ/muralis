# Muralis

Aplicacao full stack para cadastro de clientes e contatos, com backend em Spring Boot, persistencia via Spring Data JPA e frontend estatico em HTML, CSS e JavaScript servido pelo proprio backend.

O sistema trabalha com a relacao `Cliente 1:N Contato`, possui validacao de CPF, busca por nome ou CPF, operacoes CRUD para clientes e contatos e um gerador de CPF de teste para apoiar demonstracoes e validacoes manuais.

## 1. Estrutura do projeto

O projeto segue uma organizacao em camadas:

- `controller`: expõe os endpoints REST de clientes e contatos.
- `service`: concentra as regras de negocio, validacoes complementares e fluxo transacional.
- `repository`: faz o acesso ao banco com Spring Data JPA.
- `entity`: modela as tabelas `cliente` e `contato`.
- `dto`: define os objetos de entrada, saida e projecao.
- `validation`: implementa a anotacao customizada `@CpfValido`.
- `exception`: centraliza erros de dominio e o tratamento global de excecoes HTTP.
- `util`: concentra utilitarios simples, como normalizacao de CPF.
- `config`: contem configuracoes Web MVC, como CORS.
- `src/main/resources/static`: frontend estatico consumindo a API via `fetch`.
- `entregaveis`: materiais auxiliares do desafio, incluindo o script SQL para PostgreSQL.

## 2. File tree da solucao

Arvore resumida dos arquivos relevantes. A pasta `target/` nao entra na documentacao por ser gerada no build.

```text
muralis/
|-- .mvn/                              # arquivos do Maven Wrapper
|-- entregaveis/
|   |-- fluxograma.drawio             # fonte do fluxograma
|   |-- README_ENTREGAVEIS.md         # orientacoes sobre os entregaveis
|   `-- script.sql                    # DDL PostgreSQL com cliente e contato
|-- src/
|   |-- main/
|   |   |-- java/
|   |   |   `-- clients/example/muralis/
|   |   |       |-- MuralisApplication.java
|   |   |       |   # classe principal do Spring Boot
|   |   |       |
|   |   |       |-- config/
|   |   |       |   `-- WebConfig.java
|   |   |       |      # libera CORS para os metodos HTTP usados pela aplicacao
|   |   |       |
|   |   |       |-- controller/
|   |   |       |   |-- ClienteController.java
|   |   |       |   |  # CRUD de clientes, busca e endpoints aninhados de contatos
|   |   |       |   `-- ContatoController.java
|   |   |       |      # atualizacao e exclusao de contatos
|   |   |       |
|   |   |       |-- dto/
|   |   |       |   |-- ClienteRequest.java
|   |   |       |   |  # payload de entrada para criar/editar cliente
|   |   |       |   |-- ClienteResponse.java
|   |   |       |   |  # payload de saida para cliente
|   |   |       |   |-- ClienteResumo.java
|   |   |       |   |  # projecao JPA para listagem com quantidade de contatos
|   |   |       |   |-- ContatoRequest.java
|   |   |       |   |  # payload de entrada para contatos
|   |   |       |   |-- ContatoResponse.java
|   |   |       |   |  # payload de saida para contatos
|   |   |       |   `-- ErroResponse.java
|   |   |       |      # padrao de resposta para erros da API
|   |   |       |
|   |   |       |-- entity/
|   |   |       |   |-- Cliente.java
|   |   |       |   |  # entidade principal com relacionamento 1:N para contatos
|   |   |       |   `-- Contato.java
|   |   |       |      # entidade filha associada a um cliente
|   |   |       |
|   |   |       |-- exception/
|   |   |       |   |-- CpfDuplicadoException.java
|   |   |       |   |-- RecursoNaoEncontradoException.java
|   |   |       |   `-- GlobalExceptionHandler.java
|   |   |       |      # converte excecoes em respostas HTTP padronizadas
|   |   |       |
|   |   |       |-- repository/
|   |   |       |   |-- ClienteRepository.java
|   |   |       |   |  # consultas JPA, projecoes e busca por nome/CPF
|   |   |       |   `-- ContatoRepository.java
|   |   |       |      # acesso aos contatos por cliente
|   |   |       |
|   |   |       |-- service/
|   |   |       |   |-- ClienteService.java
|   |   |       |   |  # regras de negocio do cliente
|   |   |       |   `-- ContatoService.java
|   |   |       |      # regras de negocio do contato
|   |   |       |
|   |   |       |-- util/
|   |   |       |   `-- CpfUtil.java
|   |   |       |      # normalizacao de CPF para apenas digitos
|   |   |       |
|   |   |       `-- validation/
|   |   |           |-- CpfValido.java
|   |   |           `-- CpfValidoValidator.java
|   |   |              # validacao customizada de CPF, incluindo prefixo de teste
|   |   |
|   |   `-- resources/
|   |       |-- application.properties
|   |       |   # perfil padrao com H2 em memoria
|   |       |-- application-postgres.properties
|   |       |   # perfil alternativo para PostgreSQL
|   |       `-- static/
|   |           |-- index.html         # pagina inicial
|   |           |-- clientes.html      # listagem e busca de clientes
|   |           |-- cliente-form.html  # formulario de criacao/edicao
|   |           |-- contatos.html      # gerenciamento de contatos por cliente
|   |           |-- gerador.html       # gerador de CPF de teste
|   |           |-- css/
|   |           |   `-- style.css      # estilos globais da interface
|   |           `-- js/
|   |               |-- api.js         # cliente HTTP e tratamento de erros
|   |               |-- app.js         # logica do gerador de CPF
|   |               |-- cliente-form.js
|   |               |-- clientes.js
|   |               |-- contatos.js
|   |               |-- format.js      # formatacao de CPF e data
|   |               `-- musgrave-bg.js # background procedural em WebGL
|   |
|   `-- test/
|       `-- java/clients/example/muralis/
|           `-- MuralisApplicationTests.java
|              # teste basico de subida do contexto Spring
|-- HELP.md                           # referencias geradas pelo Spring Initializr
|-- mvnw
|-- mvnw.cmd
|-- pom.xml                           # configuracao Maven e dependencias
`-- README.md
```

## 3. Principais tecnologias utilizadas

- Java 17
- Spring Boot 4.0.5
- Spring Web MVC
- Spring Data JPA
- Jakarta Bean Validation
- H2 Database
- PostgreSQL
- Lombok
- Maven Wrapper
- HTML5
- CSS3
- JavaScript vanilla com `fetch`
- WebGL para o fundo procedural

## 4. Dependencias

Dependencias principais declaradas no `pom.xml`:

- `org.springframework.boot:spring-boot-h2console`
- `org.springframework.boot:spring-boot-starter-data-jpa`
- `org.springframework.boot:spring-boot-starter-validation`
- `org.springframework.boot:spring-boot-starter-webmvc`
- `org.springframework.boot:spring-boot-devtools`
- `com.h2database:h2`
- `org.postgresql:postgresql`
- `org.projectlombok:lombok`
- `org.springframework.boot:spring-boot-starter-data-jpa-test`
- `org.springframework.boot:spring-boot-starter-validation-test`
- `org.springframework.boot:spring-boot-starter-webmvc-test`

## 5. Como executar o projeto

### 5.1. Pre-requisitos

- JDK 17 instalado
- Maven instalado ou uso do Maven Wrapper (`mvnw` / `mvnw.cmd`)

### 5.2. Executando com H2 (padrao)

O perfil padrao usa H2 em memoria, configurado em `src/main/resources/application.properties`.

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

Apos subir a aplicacao:

- Home: `http://localhost:8080/index.html`
- Clientes: `http://localhost:8080/clientes.html`
- Console H2: `http://localhost:8080/h2-console`

Configuracao do console H2:

- JDBC URL: `jdbc:h2:mem:muralis`
- User Name: `Muralis`
- Password: `Muralis`

### 5.3. Executando com PostgreSQL

O perfil `postgres` usa `src/main/resources/application-postgres.properties`.

Passos:

1. Crie um banco chamado `muralis` no PostgreSQL.
2. Ajuste, se necessario, usuario e senha neste arquivo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/muralis
spring.datasource.username=postgres
spring.datasource.password=postgres
```

3. Suba a aplicacao com o perfil `postgres`.

Windows:

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=postgres
```

Linux/macOS:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

Opcionalmente, o script de apoio do banco esta em `entregaveis/script.sql`.

### 5.4. Build e testes

Compilar o projeto:

Windows:

```powershell
.\mvnw.cmd compile
```

Linux/macOS:

```bash
./mvnw compile
```

Executar testes:

Windows:

```powershell
.\mvnw.cmd test
```

Linux/macOS:

```bash
./mvnw test
```

Gerar o `.jar`:

Windows:

```powershell
.\mvnw.cmd package
```

Linux/macOS:

```bash
./mvnw package
```

Rodar o `.jar` gerado:

```bash
java -jar target/muralis-0.0.1-SNAPSHOT.jar
```

## 6. Estrutura funcional da aplicacao

### Backend

- `ClienteController` concentra o CRUD de clientes, a busca por termo e os endpoints aninhados para listar/criar contatos de um cliente.
- `ContatoController` concentra as operacoes de atualizar e excluir contatos.
- `ClienteService` garante CPF unico, normaliza CPF, trata busca por nome ou CPF, monta DTOs de resposta e faz exclusao de clientes.
- `ContatoService` valida a existencia do cliente, cria/atualiza contatos e remove o vinculo no relacionamento antes de excluir.
- `GlobalExceptionHandler` padroniza erros de validacao, conflito e recurso nao encontrado.
- `ClienteRepository` usa projecao (`ClienteResumo`) para listar clientes com quantidade de contatos sem carregar toda a colecao.
- `CpfValidoValidator` valida digitos verificadores do CPF e aceita CPFs de teste com prefixo `999999999`.

### Frontend

- `clientes.html` e `clientes.js` fazem listagem, busca e exclusao de clientes.
- `cliente-form.html` e `cliente-form.js` tratam criacao e edicao.
- `contatos.html` e `contatos.js` exibem os dados do cliente, listam contatos e usam modal para criar/editar.
- `gerador.html` e `app.js` geram CPFs validos para testes manuais.
- `api.js` centraliza chamadas HTTP e tratamento de erros da API.
- `musgrave-bg.js` cria o background procedural em WebGL e reage visualmente ao hover de botoes de exclusao.

## 7. Checklist do que foi implementado

- [x] Estrutura em camadas com separacao entre controller, service, repository, entity, dto, validation e exception
- [x] API REST para clientes
- [x] API REST para contatos
- [x] Relacao `Cliente 1:N Contato` com `CascadeType.ALL` e `orphanRemoval`
- [x] Cadastro de cliente
- [x] Edicao de cliente
- [x] Exclusao de cliente
- [x] Listagem de clientes
- [x] Busca de clientes por nome ou CPF
- [x] Cadastro de contato por cliente
- [x] Edicao de contato
- [x] Exclusao de contato
- [x] Listagem de contatos por cliente
- [x] Validacao server-side com Bean Validation
- [x] Validacao customizada de CPF com anotacao `@CpfValido`
- [x] Regra de unicidade de CPF
- [x] Padronizacao de respostas de erro com `RestControllerAdvice`
- [x] Frontend estatico integrado ao backend
- [x] Modal de manutencao de contatos
- [x] Console H2 habilitado no perfil padrao
- [x] Perfil alternativo para PostgreSQL
- [x] Script SQL de apoio para PostgreSQL
- [x] Gerador de CPF de teste na interface
- [x] Teste basico de carga do contexto Spring

## 8. Endpoints principais

| Metodo | Endpoint | Descricao |
|---|---|---|
| POST | `/clientes` | Cria um cliente |
| GET | `/clientes` | Lista clientes |
| GET | `/clientes/busca?termo=` | Busca por nome ou CPF |
| GET | `/clientes/{id}` | Detalha um cliente com seus contatos |
| PUT | `/clientes/{id}` | Atualiza um cliente |
| DELETE | `/clientes/{id}` | Exclui um cliente |
| POST | `/clientes/{clienteId}/contatos` | Cria contato para um cliente |
| GET | `/clientes/{clienteId}/contatos` | Lista contatos de um cliente |
| PUT | `/contatos/{id}` | Atualiza um contato |
| DELETE | `/contatos/{id}` | Exclui um contato |

## 9. Referencias utilizadas

Referencias oficiais e materiais uteis para os recursos usados no desafio:

- Spring Boot Reference - Servlet Web Applications: https://docs.spring.io/spring-boot/reference/web/servlet.html
- Spring Boot Maven Plugin: https://docs.spring.io/spring-boot/4.0.5/maven-plugin
- Spring Data JPA Reference: https://docs.spring.io/spring-data/jpa/reference/jpa.html
- Hibernate Validator Reference Guide: https://docs.jboss.org/hibernate/validator/8.0/reference/en-US/html_single/
- Project Lombok Features: https://projectlombok.org/features/all
- H2 Database Engine: https://h2database.com/html/main.html
- PostgreSQL JDBC Driver Documentation: https://jdbc.postgresql.org/documentation/
- MDN Web Docs - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 10. Observacoes finais

- O perfil padrao do projeto esta pronto para desenvolvimento local com H2.
- O perfil `postgres` existe para execucao com banco real e pode ser ajustado conforme o ambiente.
- O frontend esta desacoplado de frameworks JS e consome a API diretamente por `fetch`, o que deixa a solucao simples de executar e facil de inspecionar.
- Foi utilizado o uso de IA (Codex) para o desenvolvimento dessa aplicação, o uso foi mediante a: otimizações de recursos, localizaçãao de erros, criação de elementos e para realizar parte da documentação. O sistema foi revisado inteiramente e foi criado a partir de um projeto passado realizado no meu último semestre da faculdade de ADS.

## 11. Ambiente de testes

http://localhost:8080/h2-console/

Generic H2 (Server)
Generic H2 (Server)

Driver Class: org.h2.Driver
JDBC URL: jdbc:h2:mem:muralis
User Name: Muralis
Password: Muralis

(Os dados aqui apresentados foram gerados de forma aleatória, com base nos validadores da própria aplicação, não correspondendo a informações reais nem pertencendo a qualquer pessoa).

INSERT INTO cliente (nome, cpf, data_nascimento, endereco) VALUES
('Carlos Almeida', '12375801024', DATE '1995-03-12', NULL),
('Ana Pereira', '12327378281', DATE '2001-07-25', NULL),
('Bruno Santos', '12380336601', DATE '1998-11-02', NULL),
('Fernanda Costa', '12303254256', DATE '1993-06-18', NULL),
('Lucas Ribeiro', '12330363788', DATE '2000-09-30', NULL),
('Juliana Martins', '12346562726', DATE '1997-04-05', NULL),
('Rafael Gomes', '12350781089', DATE '1992-12-22', NULL),
('Camila Rocha', '12326533739', DATE '2003-01-15', NULL),
('Thiago Alves', '12379114277', DATE '1996-08-09', NULL),
('Patrícia Barros', '12314266595', DATE '1999-05-27', NULL),
('Eduardo Nunes', '12381481079', DATE '1988-10-14', NULL),
('Mariana Teixeira', '12394601710', DATE '2002-02-08', NULL),
('Gustavo Carvalho', '12396062654', DATE '1994-07-19', NULL),
('Larissa Batista', '12389262821', DATE '1991-11-11', NULL),
('Daniel Freitas', '12367375984', DATE '1989-03-03', NULL),
('Beatriz Mendes', '12347371673', DATE '2004-06-21', NULL),
('Felipe Azevedo', '12353642756', DATE '1997-09-10', NULL),
('Renata Correia', '12392959366', DATE '1993-01-28', NULL),
('André Pires', '12396781006', DATE '1990-12-17', NULL),
('Vanessa Farias', '12369185503', DATE '2001-05-04', NULL),
('Leonardo Duarte', '12384978020', DATE '1996-02-14', NULL),
('Aline Moura', '12381910379', DATE '1998-07-07', NULL),
('Rodrigo Cardoso', '12306599190', DATE '1987-09-25', NULL),
('Priscila Lopes', '12321780045', DATE '2003-03-19', NULL),
('Marcelo Araújo', '12312135906', DATE '1992-10-01', NULL),
('Carla Rezende', '12343804206', DATE '1999-06-12', NULL),
('Diego Monteiro', '12347954342', DATE '1995-08-23', NULL),
('Simone Pinto', '12326979745', DATE '2000-11-30', NULL),
('Paulo Vieira', '12331920869', DATE '1986-04-18', NULL),
('Tatiane Guedes', '12362220591', DATE '1997-01-06', NULL),
('Vinícius Tavares', '12311414178', DATE '1994-09-13', NULL),
('Elaine Borges', '12318920729', DATE '2002-12-02', NULL),
('Fábio Coelho', '12391486588', DATE '1991-07-29', NULL),
('Sabrina Neves', '12381444700', DATE '1998-05-11', NULL),
('Ricardo Cunha', '12362227251', DATE '1989-02-20', NULL),
('Débora Ramos', '12377340377', DATE '2003-08-16', NULL),
('Alexandre Melo', '12317935110', DATE '1996-03-27', NULL),
('Cláudia Peixoto', '12323578715', DATE '1990-10-08', NULL),
('Roberto Sales', '12301092690', DATE '1985-06-05', NULL),
('Kátia Nogueira', '12350505138', DATE '2001-09-22', NULL),
('Henrique Dantas', '12324317451', DATE '1997-12-14', NULL),
('Mônica Antunes', '12389265251', DATE '1993-04-09', NULL),
('Leandro Xavier', '12377487394', DATE '1988-11-26', NULL),
('Patrícia Lacerda', '12355257914', DATE '2004-01-03', NULL),
('Caio Figueiredo', '12378041241', DATE '1999-07-17', NULL),
('Julio César', '12389960944', DATE '1992-05-28', NULL),
('Rosana Queiroz', '12385849933', DATE '1996-08-31', NULL),
('Maurício Braga', '12383693839', DATE '1987-03-15', NULL),
('Isabela Torres', '12318891524', DATE '2000-10-20', NULL),
('Douglas Pinheiro', '12399436954', DATE '1995-02-11', NULL);
