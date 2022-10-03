const { RESTDataSource } = require("apollo-datasource-rest")

class UsersAPI extends RESTDataSource {

    constructor() {
        super()
        this.baseURL = 'http://localhost:3000'
    }

    async getUsers() {
        const users = await this.get('/users')

        return users.map(async user => ({
            ...user,
            role: await this.get(`/roles/${user.role}`)
        }))
    }

    async getUserById(id) {
        const user = await this.get(`/users/${id}`)
        user.role = await this.get(`/roles/${user.role}`)

        return user
    }

    async adicionarUser(user) {

        const users = await this.getUsers()
        const role = await this.get(`/roles?type=${user.role}`)

        user.id = users.length + 1

        await this.post("users", { ...user, role: role[0].id })

        return ({
            ...user,
            role: role[0]
        })
    }

    async atualizarUser(novoDados) {

        const role = await this.get(`/roles?type=${novoDados.role}`)

        await this.put(`users/${novosDados.id}`, { ...novoDados, role: role[0].id })

        return ({
            ...user,
            role: role[0]
        })
    }

    async deletarUser(id) {
        await this.delete(`users/${id}`)
        return ({ id })
    }
}

module.exports = UsersAPI