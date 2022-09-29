Graph QL
=========

- [Graph QL](#graph-ql)
  - [Definição](#definição)
    - [Instrospection](#instrospection)
    - [Null Fields](#null-fields)
      - [Fields](#fields)
      - [Lists](#lists)
  - [Schema Definition Language](#schema-definition-language)
    - [Schalar Types](#schalar-types)
    - [Object Type](#object-type)
    - [Query Type](#query-type)
    - [Mutation Type](#mutation-type)
  - [Dados](#dados)
  - [DataSource](#datasource)
  - [TypeDefs](#typedefs)
  - [Resolvers](#resolvers)
    - [Parâmetros](#parâmetros)
  - [Overview sobre Apollo Server](#overview-sobre-apollo-server)

<br>

## Definição

> Conceito chave: Schemas baseados em como os dados são usados, não em como estão armazenados

- Especificação + linguagem de query para APIs
- Ambiente que executa queries
- Agnóstico com protocolos
- Otimizar relação front x back
- Desenvolvimento mais ágil

O GraphQL faz uma separação clara entre **estrutura** e **comportamento**.

A estrutura do GraphQL está no schema, no qual especifica-se o que o servidor GraphQL está estruturado para fazer, com seus tipos e objetos.

Essa estrutura precisa ser implementada de alguma forma para que possa funcionar. No GraphQL, isso se dá através do que chamamos de funções resolver, ou só resolvers. É nos resolvers que implementamos o comportamento. Cada campo em um schema GraphQL é implementado através de um resolver.

É aqui que entram ferramentas como Apollo, servem para nos ajudar a implementar a especificação GraphQL em nossa aplicação.

Ver depois

Além dos tipos acima, o GraphQL ainda tem mais tipos básicos que trabalharemos com mais detalhes durante o curso:

Enum,
Input,
Interface,
Union.

### Instrospection

> Ferramenta que nos permite visualizar os tipos e queries disponíveis em uma API, o que facilita muito a vida de quem vai trabalhar com ela.

```gql
{
  __schema {
    types {
      name
    }
  }
}
```

E você terá acesso a todos os types definidos na API ou, como pode
se tratar de uma API pública, a todos os tipos que estão disponíveis.

- Scalars, como “Boolean”
- Tipos definidos na construção da API, como “Users” e tipos relacionados a “User”
- Tipos iniciados com \_\_, que são parte do sistema de _introspecção_.

Verificando qual é o ponto de entrada da API:

```gql
{
  __schema {
    queryType {
      name
    }
  }
}
```

Fazendo o teste no playground do GitHub, o retorno é "name": "Query".
O que significa que a API tem um type Query, onde estão definidos os pontos de entrada para consulta à API…
Vale notar aqui que _poderia ser adotado qualquer nome para o tipo, mas utilizar Query é uma convenção_, então vamos utilizá-lo.

Podemos passar mais subcampos para ter mais informações ainda sobre os tipos disponíveis nessa API:

```gql
query {
  __schema {
    types {
      name
      kind
      fields {
        name
      }
    }
  }
}
```

Essa query vai nos retornar informações mais completas sobre cada tipo: nome, se é objeto, scalar, input; no caso de objetos, quais campos estão associados, e muito mais.

Um último teste: Como saber de que se trata certo tipo, por exemplo “Actor”, que aparece na lista de tipos disponíveis na API:

```gql
{
  __type(name: "Actor") {
    name
    kind
  }
}
```

### Null Fields

> O GraphQL tem uma forma peculiar de trabalhar com campos nulos por 
> conta disso essa parte é dedicada a explicação de algumas coisas relacionadas
> a isso

#### Fields

Já vimos que, quando queremos que o valor de um campo nunca seja nulo, utilizamos exclamação ( ! ). Como no campo nome no tipo User:

```gql
type User {
    nome: String!
    .
    .
    .
}
```

Aqui deixamos explícito que o valor de `nome` sempre deve retornar algum valor; ou seja, nunca pode ser `null`. 
O contrário fará com que o GraphQL lance um erro.

#### Lists

E quando trabalhamos com listas de dados? 
Nesse caso, existe uma diferença na parte do código onde declaramos !.

__Primeiro caso__: uma query que pede uma lista de usuários.
O ponto de exclamação está somente depois dos colchetes [].
Ou seja, a query users em si não pode retornar null, mas pode conter null entre os itens retornados na lista.

```gql
type Query {
    users: [User]!
}
```

Exemplos de retorno:

```gql
users: [{user}, null, {user}] //retorno válido
users: null //retorna erro
```

__Segundo caso__: o ponto de exclamação está dentro dos colchetes da lista, junto ao tipo que queremos retornar na lista. Ou seja, a lista em si pode ser nula, mas não pode retornar itens nulos.

```gql
type Query {
    users: [User!]
}
```

Exemplos de retorno:

```gql
users: null //retorno válido
users: [{user}, {user}] //retorno válido
users: [{user}, null, {user}] //retorna erro
```

__Terceiro caso__: o ponto de exclamação aparece junto ao tipo de retorno e também junto ao fechamento dos colchetes da lista.
Ou seja, deve retornar obrigatoriamente uma lista que não contenha null entre seus itens.

__Atenção: uma lista vazia é um retorno válido!__

```gql
type Query {
    users: [User!]!
}
```

Exemplos de retorno:

```gql
users: [] //retorno válido
users: null //retorna erro
users: [{user}, {user}] //retorno válido
users: [{user}, null, {user}] //retorna erro
```

>No GraphQL, todos os campos são definidos como `“anuláveis”` por padrão.
>Ao definir os campos de um tipo como obrigatórios (não-nulos), devemos pensar em como os dados serão utilizados e também em como estão definidos na base de dados.
>Por exemplo, definir como obrigatório um campo cuja origem dos dados seja uma coluna SQL sem a restrição __NOT NULL__ pode nos trazer erros.

Pode parecer uma boa ideia sempre declarar todos os campos possíveis como não-nulos, mas isso pode fazer com que fique difícil evoluir o schema, especialmente quando trabalhamos com diversas fontes de dados.

<br><br>

## Schema Definition Language

> O GraphQL tem sua própria linguagem, chamada de SDL, ou Schema Definition Language, linguagem de definição de schema. Isso porque é possível implementar o GraphQL em conjunto com qualquer outra linguagem, então a SDL serve para fazer essa integração de forma agnóstica. Para entender como essa linguagem funciona, sempre temos que ter em mente que o GraphQL trabalha com _tipos_, e saber quais tipos são esses.

<br>

### Schalar Types

São tipos que refletem alguns dos tipos de dados que já conhecemos. Para o GraphQL, são os tipos que se resolvem em dados concretos (ao contrário de objetos, por exemplo, que são conjuntos de dados). São eles:

- Int - inteiro de 32 bits
- Float - tipo ponto flutuante
- String - sequência de caracteres no formato UTF-8
- Boolean - true ou false
- ID - identificador único, usado normalmente para localizar dados É possível criar tipos scalar customizados, estudaremos mais adiante neste curso.

<br>

### Object Type

Quando trabalhamos com GraphQL, o ideal é pensarmos no uso dos dados, mais do que na forma em que estão armazenados. Pensando nisso, nem sempre queremos retornar um dado concreto, mas sim um conjunto de dados com propriedades específicas — ou seja, um objeto.

Um exemplo de tipo Objeto (Object type) em GraphQL:

```gql
type Livro {
  id: ID!
  titulo: String!
  autoria: String!
  paginas: Int!
  colecoes: [Colecao!]!
}
```

No exemplo acima, estamos definindo o tipo Objeto `Livro`.

As propriedades — que no GraphQL são chamadas de campos — retornam tipos scalar, como strings e inteiros, e também podem retornar arrays compostas de outros objetos, como no caso de `colecoes: [Colecao!]!`.

Note que na definição do objeto não está especificado de qual base de dados virão esses dados, _apenas quais dados o GraphQL espera receber, e de que tipos_.

Os campos marcados com exclamação `!` são campos que não podem ser nulos.
Ou seja, qualquer query que envolva estes campos sempre devem ter algum valor do tipo esperado.
No caso de colecoes: `[Colecao!]!` a exclamação após o fechamento da array significa que o campo `colecoes` sempre vai receber uma array (tendo ou não elementos dentro dela); a exclamação em `Colecao!` significa que qualquer elemento dentro da array sempre vai ser um objeto `Colecao`.

<br>

### Query Type

Os tipos Query definem os pontos de entrada (entry points) da API;
indicam quais dados o cliente pode receber e de que forma — de certa forma, são como queries do tipo GET quando trabalhamos com REST, a diferença aqui é que o cliente tem mais liberdade para montar as queries para receber apenas os dados que precisa — lembrando que, para o GraphQL e também para o cliente, não importa a origem desses dados.
os dados podem vir de diversas fontes: **endpoints REST, bancos SQL e NoSQL, outro servidor GraphQL**.

Um exemplo de tipo Query:

```gql
type Query {
  livros: [Livro!]!
  livro(id: ID!): Livro!
}
```

Aqui definimos a query `livros`, que retorna uma array composta por tipos objeto `Livro`, e a query `livro`, que recebe um número de ID por parâmetro e retorna um objeto `Livro` referente ao ID informado.

> Uma vez que as queries são os pontos de entrada de uma API GraphQL, toda aplicação vai ter pelo menos uma Query em seu schema.

<br>

### Mutation Type

> Mutations são os tipos GraphQL utilizados para adicionar, alterar e deletar dados, de forma similar às operações de POST, PUT e DELETE nos CRUDs desenvolvidos em REST.

Os tipos Query são obrigatórios em qualquer serviço GraphQL,
porém Mutations são opcionais.

Um exemplo de tipo Mutation para adicionar um novo livro:

```gql
type Mutation {
  adicionaLivro(
    titulo: String!
    autoria: String!
    paginas: Int!
    colecoes: Colecao!
  ): Livro!
}
```

<br><br>

## Dados

> O GraphQL pode ser usado em combinação com qualquer base de dados e até mesmo utilizar várias ao mesmo tempo.

Existem diversas plataformas para conectar sua API a determinadas bases de dados, e como já vimos, existem algumas libs que oferecem ferramentas para isso. Neste curso usamos Apollo, que no momento deste curso é uma das mais utilizadas.

Além de módulos para uso com REST (o caso do projeto deste curso), existem também libs para utilizar outras fontes de dados em conjunto com as ferramentas da Apollo, de forma similar à que estamos fazendo:

- [SQL DataSource](https://github.com/cvburgess/SQLDataSource): para bancos SQL
- [Mongo DataSource](https://github.com/GraphQLGuide/apollo-datasource-mongodb/): para MongoDB
- [GraphQL DataSource](https://github.com/poetic/apollo-datasource-graphql): para utilizar outra API GraphQL como fonte de dados.
- Se você quiser testar outras bases em seu projeto, [este artigo do blog da Apollo](https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/) dá maiores detalhes de implementação para as três libs acima.

Uma outra opção para utilizar o GraphQL com SQL é a [Prisma](https://www.prisma.io/), que integra bancos SQL (Postgres, MySQL ou SQLite) ao GraphQL, abstraindo as conexões com o banco e as queries.

Além dessas, no momento em que escrevemos este texto, temos mais algumas opções como:

- [Hasura](https://hasura.io/) para Postgres, outros serviços GraphQL e APIs REST;
- [AWS AppSync](https://aws.amazon.com/pt/appsync/) para DynamoDB, Elasticsearch e Aurora;
- [Stitch](https://docs.mongodb.com/stitch/graphql/) para MongoDB.
  Aproveite para testar outras ferramentas!

<br><br>

## DataSource

sim

## TypeDefs

teste

## Resolvers

### Parâmetros

Já conferimos quatro parâmetros do resolver e qual tipo de dado cada um deles carrega:

- `root (ou parent)`: o resultado da chamada no “nível” anterior da query;
- `args`: os argumentos que o resolver pode receber da query, por exemplo os dados para um novo User ou um `ID`;
- `context`: um objeto com o contexto para o GraphQL, como dados sobre a conexão, permissões de usuário, etc;
- `info`: a representação em árvore da query ou da mutation.

```javascript
const userResolvers = {
  Query: {
    users: (root, args, { dataSources }, info) => {
      console.log({ info });
      return dataSources.userAPI.getUsers();
    },
    user: () => dados.users[0],
  },
};
```

## Overview sobre Apollo Server

[Documentação](https://www.apollographql.com/docs/apollo-server/)
