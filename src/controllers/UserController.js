const User = require("../models/user")
const bcrypt = require('bcryptjs')
const path = require('path');

const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 60000,
    })
}

module.exports = {

    async logout(req, res) {
        try {
            const userId = req.body.userId;
            await User.update({ islogged: false }, { where: { id: userId } });
            res.status(200).json({ message: 'Usuário deslogado com sucesso!' });
        } catch (error) {
            return res.status(500).json({
                message: "Erro no servidor!"
            });
        }
    },
    async checkAuth(req, res) {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({
                    Auth: false,
                    message: "É necessário estar logado!"
                });
            }

            try {
                const [, tokenWithoutBearer] = token.split("Bearer ");
                const decoded = jwt.verify(tokenWithoutBearer, authConfig.secret);
                const userId = decoded.id;

                const user = await User.findOne({
                    where: {
                        id: userId,
                        islogged: true,
                    },
                });

                if (!user) {
                    return res.status(401).json({
                        Auth: false,
                        message: "Erro inesperado!"
                    });
                }

                return res.status(200).json({
                    Auth: true,
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    image: user.image,
                    usertype: user.usertype,
                    accesslevel: user.accesslevel,
                    email: user.email,
                });
            } catch (error) {
                console.error("Erro ao verificar autenticação do usuário 1:", error);
                return res.status(500).send({
                    status: 0,
                    message: "Erro ao verificar autenticação do usuário 1"
                });
            }
        } catch (error) {
            console.error("Erro ao verificar autenticação do usuário 2:", error);
            return res.status(500).send({
                status: 0,
                message: "Erro ao verificar autenticação do usuário 2"
            });
        }
    },
    async login(req, res) {
        try {
            const { password, email, islogged } = req.body

            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(200).send({
                    status: 0,
                    message: "Credenciais inválidas!"
                })
            }

            if (user.accesslevel === 0) {
                return res.status(200).send({
                    status: 0,
                    message: "Usuário bloqueado!"
                })
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(200).send({
                    status: 0,
                    message: "Credenciais inválidas!"
                })
            }

            const user_id = user.id

            await User.update({
                islogged
            }, {
                where: {
                    id: user_id
                }
            });

            user.password = undefined

            const token = generateToken(
                {
                    id: user_id,
                    firstname: user.firstname,
                    usertype: user.usertype,
                    accesslevel: user.accesslevel,
                }
            )

            return res.status(200).send({
                status: 1,
                message: "Usuário logado com sucesso!",
                user, token
            })
        } catch (error) {
            console.error("Erro ao logar usuário:", error);
            return res.status(500).send({
                status: 0,
                message: "Erro ao logar usuário"
            });
        }

    },

    async index(req, res) {
        const users = await User.findAll()

        if (users == "" || users == null) {
            return res.status(200).send({ message: "Nenhum usuário cadastrado!" })
        }

        return res.status(200).send({ users })
    },
    async store(req, res) {
        try {
            const { firstname, lastname, email, usertype, password } = req.body
            const imageUrls = req.files.map((file) => file.path.replace(/\\/g, '/'));
            const image = imageUrls[0].replace("public/images/", "");

            const user = await User.create({
                firstname,
                lastname,
                usertype,
                email,
                password,
                image: image,
            })

            const token = generateToken({ id: user.id })

            return res.status(200).send({
                status: 1,
                message: "Usuário cadastrado com sucesso!",
                user, token
            })
        } catch (error) {
            console.error("Erro ao cadastrar usuário: ", error);
            return res.status(500).send({
                status: 0,
                message: "Erro ao cadastrar usuário",
            });
        }
    },
    async update(req, res) {
        const { firstname, lastname, email, password, newpassword } = req.body;
        const { user_id } = req.params;

        try {
            const user = await User.findOne({ where: { id: user_id } });

            if (!user) {
                return res.status(404).send({
                    status: 0,
                    message: "Usuário não encontrado.",
                });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                console.log("Senha errada!")
                return res.status(401).send({
                    status: 0,
                    message: "Senha atual incorreta.",
                });
            }

            // Atualizar o usuário se a senha estiver correta
            await User.update(
                { firstname, lastname, email, password: newpassword },
                { where: { id: user_id } }
            );

            return res.status(200).send({
                status: 1,
                message: "Usuário atualizado com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao atualizar usuário: ", error);
            return res.status(500).send({
                status: 0,
                message: "Erro ao atualizar usuário",
            });
        }

    },
    async delete(req, res) {
        const { user_id } = req.params
        await User.destroy({
            where: {
                id: user_id
            }
        })

        return res.status(200).send({
            status: 1,
            message: "Usuário deletado com sucesso!",
        })
    },
    async changeStatusUser(req, res) {
        try {
            const { userid } = req.body;
            const user = await User.findByPk(userid);
            if (user) {
                if (user.accesslevel == 1)
                    user.accesslevel = 0;
                else
                    user.accesslevel = 1;

                await user.save();
                res.status(200).json({ message: 'Usuário alterado com sucesso' });
            } else {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ocorreu um erro ao alterar o usuário!' });
        }
    },
}