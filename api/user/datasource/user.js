const { RESTDataSource } = require("apollo-datasource-rest")

class UsersAPI extends RESTDataSource {

    constructor() {
        super()
        this.baseURL = 'http://localhost:3000'
        this.respostaCustom = {
            httpStatusCode: 200,
            mensagem: "Operação efetuada com sucesso"
        }
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

    async formatUser(novosDados) {

        if (novosDados.user.role) {
            const role = await this.get(`/roles?type=${novosDados.user.role}`)
            novosDados.user.role = role[0].id
        }

        return { id: novosDados.id, ...novosDados.user }
    }

    async atualizarUser(novosDados) {

        try {

            await this.put(`users/${novosDados.id}`, this.formatUser(novosDados))
        } catch (error) {

            this.respostaCustom.httpStatusCode = 400
            this.respostaCustom.mensagem = "Ocorreu um erro ao atualizar o usuário"

            return {
                ...this.respostaCustom,
                user: {}
            }
        }

        return ({
            ...this.respostaCustom,
            user: {
                ...novosDados.user,
            }
        })
    }

    async deletarUser(id) {
        try {
            await this.delete(`users/${id}`)

        } catch (error) {
            this.respostaCustom.httpStatusCode = 400
            this.respostaCustom.mensagem = "Ocorreu um erro ao deletar um usuário"
            return this.respostaCustom

        }
        return this.respostaCustom
    }
}

module.exports = UsersAPI