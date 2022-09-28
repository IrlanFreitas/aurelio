const dados = require('../../data/dados.json')

const userResolvers = {
    Query: {
        users: () => dados.users,
        primeiroUser: () => dados.users[0]
    }
}

module.exports = userResolvers