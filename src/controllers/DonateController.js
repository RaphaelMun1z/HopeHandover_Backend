const Donate = require('../models/donate');
const User = require('../models/user');
const RealizedDonate = require('../models/realizeddonate');
const Project = require("../models/project");
const Handshakeds = require("../models/handshaked");

const { Op } = require('sequelize');
const { use } = require('../router/router');

module.exports = {
    async indexPeopleDonor(req, res) {
        try {
            const donors = await User.findAll({
                where: {
                    userType: 1,
                },
            });

            return res.status(200).json({
                status: 1,
                message: "Lista de doadores recuperada com sucesso!",
                donors,
            });
        } catch (err) {
            console.error("Erro: " + err);
            return res.status(500).json({ error: "Erro ao listar os doadores" });
        }
    },
    async indexCompanyDonor(req, res) {
        try {
            const donors = await User.findAll({
                where: {
                    userType: 2,
                },
            });

            return res.status(200).json({
                status: 1,
                message: "Lista de empresas doadores recuperada com sucesso!",
                donors,
            });
        } catch (err) {
            console.error("Erro: " + err);
            return res.status(500).json({ error: "Erro ao listar as empresas doadores" });
        }
    },
    async index(req, res) {
        try {
            const donates = await Donate.findAll({
                where: {
                    status: 0,
                },
                include: [
                    {
                        model: Project,
                        as: 'project',
                        include: [
                            {
                                model: User,
                                as: 'user'
                            }
                        ],
                        where: { status: 1 },
                    },
                ],
            })

            return res.status(200).json({
                status: 1,
                message: "Lista de donates recuperada com sucesso!",
                donates
            });
        } catch (err) {
            console.error("Erro: " + err);
            return res.status(500).json({ error: "Erro ao listar os donates" });
        }
    },
    async create(req, res) {
        try {
            const { project_id, title, amount } = req.body;
            const imageUrls = req.files.map((file) => file.path.replace(/\\/g, '/'));
            const image = imageUrls[0].replace("public/images/", "");

            const donate = await Donate.create({
                project_id,
                title,
                amount,
                image: image,
                defaults: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            return res.status(200).json({
                status: 1,
                message: "Donate cadastrado com sucesso!",
                donate
            });

        } catch (err) {
            console.log("Erro: " + err)
            return res.status(400).json({ error: err });
        }
    },
    async completeDonation(req, res) {
        try {
            const { user_id, item_id } = req.body;

            if (!user_id || !item_id) {
                return res.status(400).json({ error: "Faltam dados" });
            }

            const realizedDonate = await RealizedDonate.create({
                user_id,
                item_id,
                defaults: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            console.log("AAAAAAAAAAAA")

            await Donate.update(
                { status: 1 },
                {
                    where: {
                        donate_id: item_id
                    }
                }
            );

            return res.status(200).json({
                status: 1,
                message: "Donate realizado com sucesso!",
                realizedDonate
            });

        } catch (err) {
            console.log("Erro: " + err)
            return res.status(400).json({ error: err });
        }
    },
    async indexDonateByUser(req, res) {
        try {
            const { user_id } = req.params;

            const projects = await Project.findAll({
                where: {
                    ownid: user_id,
                },
            });

            const donates = await Donate.findAll({
                include: [
                    {
                        model: Project,
                        as: 'project',
                        attributes: ['title', 'image1'],
                        where: {
                            ownid: user_id,
                        },
                    },
                    {
                        model: RealizedDonate,
                        as: 'realizeddonate',
                    },
                ],
                where: {
                    project_id: {
                        [Op.in]: projects.map((project) => project.id),
                    },
                },
            });

            console.log(donates)

            return res.status(200).json({
                status: 1,
                message: "Lista de doações do usuário recuperada com sucesso!",
                donates,
            });
        } catch (err) {
            console.error("Erro: " + err);
            return res.status(500).json({ error: "Erro ao listar as doações do usuário" });
        }
    },
    async indexDonatesRealizedByUser(req, res) {
        try {
            const { user_id } = req.params;
            console.log(user_id)

            const rDonates = await RealizedDonate.findAll({
                where: {
                    user_id: user_id,
                },
            });

            const realizedDonates = await Donate.findAll({
                include: [
                    {
                        model: Project,
                        as: 'project',
                        attributes: ['title', 'image1'],
                    },
                ],
                where: {
                    donate_id: {
                        [Op.in]: rDonates.map((rDonate) => rDonate.item_id),
                    },
                },
            });

            return res.status(200).json({
                status: 1,
                message: "Lista de doações realizadas pelo usuário recuperada com sucesso!",
                realizedDonates,
            });
        } catch (err) {
            console.error("Erro: " + err);
            return res.status(500).json({ error: "Erro ao listar as doações realizadas pelo usuário" });
        }
    },
    async indexAcknowledgmentByUser(req, res) {
        try {
            const { user_id } = req.params;

            const handshakeds = await Handshakeds.findAll({
                where: {
                    donor_id: user_id,
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            });

            console.log(handshakeds)

            return res.status(200).json({
                status: 1,
                message: "Lista de agradecimentos recuperada com sucesso!",
                handshakeds,
            });
        } catch (err) {
            console.error("Erro: " + err);
            return res.status(500).json({ error: "Erro ao listar os agradecimentos" });
        }
    },
    async updateStatusDonated(req, res) {
        try {
            const { newStatus, donateId } = req.body;

            if (donateId == null || newStatus == null) {
                return res.status(500).json({
                    message: 'Erro ao atualizar o status da doação.',
                });
            }

            const [updatedRows] = await Donate.update(
                { status: newStatus },
                {
                    where: {
                        donate_id: donateId,
                    },
                }
            );

            if (updatedRows > 0) {
                return res.status(200).json({
                    message: 'Status atualizado com sucesso!',
                });
            } else {
                return res.status(404).json({
                    message: 'Doação não encontrada.',
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar o status da doação:', error);
            return res.status(500).json({
                message: 'Erro ao atualizar o status da doação.',
            });
        }
    },
    async getDonorData(req, res) {
        try {
            const { user_id } = req.params;

            const user = await User.findOne({
                where: { id: user_id },
            });

            if (!user || user.length === 0) {
                return res.status(404).send({ message: "Usuário inexistente!" });
            }

            return res.status(200).send({ user });
        } catch (err) {
            console.error("Erro ao obter usuário: ", err);
            return res.status(500).send({
                status: 0,
                message: "Erro ao obter usuário"
            });
        }
    },

};