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
    }
}

module.exports = userResolvers