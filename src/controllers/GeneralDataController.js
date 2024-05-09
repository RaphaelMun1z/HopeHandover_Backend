const QuestionContact = require("../models/questioncontact")

module.exports = {
    async store(req, res) {
        try {
            const { name, email, question } = req.body

            const form = await QuestionContact.create({
                name,
                email,
                question,
            })

            return res.status(200).send({
                status: 1,
                message: "Usuário cadastrado com sucesso!",
                form
            })
        } catch (error) {
            console.error("Erro ao enviar mensagem: ", error);
            return res.status(500).send({
                status: 0,
                message: "Erro ao enviar mensagem",
            });
        }
    },
}