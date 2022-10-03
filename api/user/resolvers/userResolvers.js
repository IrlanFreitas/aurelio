const dados = require('../../data/dados.json')

const userResolvers = {
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
        adicionarUser: async (root, args, { dataSources }, info) => {
            dataSources.userAPI.adicionarUser(args.user)
        },
        atualizarUser: async (root, args, { dataSources }, info) => {
            dataSources.userAPI.atualizarUser(args.novosDados)
        },
        deletarUser: async (root, args, { dataSources }, info) => {
            dataSources.userAPI.deletarUser(args.id)
        },
    }
}

module.exports = userResolvers