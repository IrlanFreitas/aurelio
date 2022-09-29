const { ApolloServer } = require('apollo-server')
const { mergeTypeDefs } = require('graphql-tools')

const userResolvers = require('./user/resolvers/userResolvers')
const userSchema = require('./user/schema/user.graphql')
const UserAPI = require('./user/datasource/user')

// const produtoResolvers = require('./produtos/resolvers/produtoResolvers')
const produtoSchema = require('./produto/schema/produto.graphql')

// const resolvers = [userResolvers, produtoResolvers]
// const typeDefs =  mergeTypeDefs([userSchema, produtoSchema])

const typeDefs = [userSchema]
const resolvers = [userResolvers]

const server = new ApolloServer({
    typeDefs, resolvers,
    dataSources: () => {
        return {
            userAPI: new UserAPI()
        }
    },
    introspection: true,
    playground: true,
})

server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`\nServidor rodando na porta ${url}\n`);
})