# O que é e o que faz

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

## Introspecção (Instrospection)

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
- Tipos iniciados com __, que são parte do sistema de *introspecção*.


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
Vale notar aqui que *poderia ser adotado qualquer nome para o tipo, mas utilizar Query é uma convenção*, então vamos utilizá-lo.


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

<br><br>

# Schema Definition Language

> O GraphQL tem sua própria linguagem, chamada de SDL, ou Schema Definition Language, linguagem de definição de schema. Isso porque é possível implementar o GraphQL em conjunto com qualquer outra linguagem, então a SDL serve para fazer essa integração de forma agnóstica. Para entender como essa linguagem funciona, sempre temos que ter em mente que o GraphQL trabalha com _tipos_, e saber quais tipos são esses.

<br>

## Schalar Types

São tipos que refletem alguns dos tipos de dados que já conhecemos. Para o GraphQL, são os tipos que se resolvem em dados concretos (ao contrário de objetos, por exemplo, que são conjuntos de dados). São eles:

- Int - inteiro de 32 bits
- Float - tipo ponto flutuante
- String - sequência de caracteres no formato UTF-8
- Boolean - true ou false
- ID - identificador único, usado normalmente para localizar dados É possível criar tipos scalar customizados, estudaremos mais adiante neste curso.

<br>

## Object Type

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

## Query Type

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

## Mutation Type

> Mutations são os tipos GraphQL utilizados para adicionar, alterar e deletar dados, de forma similar às operações de POST, PUT e DELETE nos CRUDs desenvolvidos em REST.

Os tipos Query são obrigatórios em qualquer serviço GraphQL,
porém Mutations são opcionais.

Um exemplo de tipo Mutation para adicionar um novo livro:

```gql
    type Mutation {
        adicionaLivro(titulo: String!, autoria: String!, paginas: Int!, colecoes: Colecao!): Livro!
    }
```

<br><br>

# TypeDefs

# Resolvers

teste

# Overview sobre Apollo Server

[Documentação](https://www.apollographql.com/docs/apollo-server/)
