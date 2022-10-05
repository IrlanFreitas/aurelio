const dados = require('../../data/dados.json')

const { GraphQLScalarType } = require('graphql')

const userResolvers = {
    respostaCustom: {
        __resolveType(obj, context, info) {
            return false
        },
    },
    RolesType: {
        ESTUDANTE: "ESTUDANTE",
        DOCENTE: "DOCENTE",
        COORDENACAO: "COORDENAÇÃO"
    },
    DateTime: new GraphQLScalarType({
        name: "DateTime",
        description: "String de data e hora no formato ISO-8601",
        serialize: (value) => value.toISOString(),
        parseValue: (value) => new Date(value),
        parseLiteral: (ast) => new Date(ast.value)
    }),
    Query: {
        users: (root, args, { dataSources }, info) => {
            console.log({ info })
            return dataSources.userAPI.getUsers()
        },
        user: (root, { id }, { dataSources }, info) => {
            console.log({ info })
            return dataSources.userAPI.getUserById(id)
        }
    },
    Mutation: {
        adicionarUser: async (root, { user }, { dataSources }, info) => {
            //Os dados agora vem do input
            return dataSources.userAPI.adicionarUser(user)
        },
        atualizarUser: async (root, novosDados, { dataSources }, info) => {
            return dataSources.userAPI.atualizarUser(novosDados)
        },
        deletarUser: async (root, args, { dataSources }, info) => {
            return dataSources.userAPI.deletarUser(args.id)
        },
    }
}

module.exports = userResolvers