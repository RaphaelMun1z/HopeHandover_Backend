const Project = require("../models/project")
const User = require("../models/user");
const SavedProject = require("../models/savedproject")
const HandShaked = require("../models/handshaked")
const ProjectMidia = require("../models/projectmidia")
const Address = require("../models/address")

module.exports = {
    async index(req, res) {
        try {
            const projects = await Project.findAll({
                where: { status: 1 },
                include: [
                    {
                        model: User,
                        as: 'user',
                        include: [
                            {
                                model: Address,
                                as: 'address',
                            },
                        ],
                    },
                    {
                        model: ProjectMidia,
                        as: 'projectmidia',
                    },
                ],
            });

            if (projects == "" || projects == null) {
                return res.status(200).send({ message: "Nenhum projeto cadastrado!" });
            }

            return res.status(200).send({ projects });
        } catch (err) {
            console.error("Erro ao obter projetos: ", err);
            return res.status(500).send({
                status: 0,
                message: "Erro ao obter projetos"
            });
        }
    },
    async indexAll(req, res) {

        try {
            const projects = await Project.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        include: [
                            {
                                model: Address,
                                as: 'address',
                            },
                        ],
                    },
                    {
                        model: ProjectMidia,
                        as: 'projectmidia',
                    },
                ],
            });

            if (projects == "" || projects == null) {
                return res.status(200).send({ message: "Nenhum projeto cadastrado!" });
            }

            return res.status(200).send({ projects });
        } catch (err) {
            console.error("Erro ao obter projetos: ", err);
            return res.status(500).send({
                status: 0,
                message: "Erro ao obter projetos"
            });
        }
    },
    async indexById(req, res) {
        try {
            const { project_id } = req.params;

            const project = await Project.findOne({
                where: { id: project_id },
                include: [
                    {
                        model: User,
                        as: 'user',
                        include: [
                            {
                                model: Address,
                                as: 'address',
                            },
                        ],
                    },
                    {
                        model: ProjectMidia,
                        as: 'projectmidia',
                    },
                ],
            });

            const address = await Address.findOne({
                where: {
                    id: project.address,
                },
            })

            project.address = address;

            if (!project || project.length === 0 || project.address.length === 0) {
                return res.status(404).send({ message: "Projeto inexistente!" });
            }

            return res.status(201).send({ project });
        } catch (err) {
            console.error("Erro ao obter projeto: ", err);
            return res.status(500).send({
                status: 0,
                message: "Erro ao obter projeto"
            });
        }
    },
    async indexByUser(req, res) {
        try {
            const { user_id } = req.params;

            const projects = await Project.findAll({
                where: { ownid: user_id },
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['firstname'],
                },
            });

            if (!projects || projects.length === 0) {
                return res.status(200).send({ message: "Nenhum projeto cadastrado para este usuário!" });
            }

            return res.status(201).send({ projects });
        } catch (err) {
            console.error("Erro ao obter projetos: ", err);
            return res.status(500).send({
                status: 0,
                message: "Erro ao obter projetos"
            });
        }
    },
    async store(req, res) {
        try {
            const { ownid, contact, title, event, address, description } = req.body;
            const images = req.files;

            const imageUrls = images.map(image => `${image.filename}`);

            const project = await Project.create({
                ownid,
                contact,
                title,
                event,
                address,
                description,
                image1: imageUrls[0],
                image2: imageUrls[1],
                image3: imageUrls[2],
            });

            return res.status(201).json({
                status: 1,
                message: "Projeto cadastrado com sucesso!",
                project
            });
        } catch (error) {
            console.error("Erro ao cadastrar projeto: ", error);
            return res.status(500).json({
                status: 0,
                message: "Erro ao cadastrar projeto"
            });
        }
    },
    async delete(req, res) {
        const id = req.params.id;

        try {
            const address = await Address.findByPk(id);

            if (address) {
                await Address.destroy({ where: { id } });

                return res.status(200).json({
                    status: 1,
                    message: "Address apagado com sucesso!",
                });

            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'Address não encontrado!'
                });
            }


        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },
    async update(req, res) {
        const project_id = req.params.project_id;
        const { contact, title, event, address, description, status } = req.body;

        try {
            const project = await Project.findByPk(project_id);

            if (project) {
                if (contact) project.contact = contact;
                if (title) project.title = title;
                if (event) project.event = event;
                if (address) project.address = address;
                if (description) project.description = description;
                if (status) project.status = status;

                await project.save();

                return res.status(200).json({
                    status: 1,
                    message: "Projeto atualizado com sucesso!",
                });

            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'Projeto não encontrado!'
                });
            }

        } catch (err) {
            return res.status(400).json({
                status: 0,
                message: 'Erro ao atualizar o projeto!'
            });
        }
    },
    async saveProject(req, res) {
        try {
            const { userid, projectid } = req.body;
            console.log(req.body)
            const existingProject = await SavedProject.findOne({ where: { userid, projectid } });

            if (existingProject) {
                await existingProject.destroy();
                res.status(200).json({ message: 'Projeto retirado do status salvo com sucesso' });
            } else {
                const [savedProject, created] = await SavedProject.findOrCreate({
                    where: { userid, projectid },
                    defaults: {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                res.status(200).json({ message: 'Projeto salvo com sucesso', savedProject, created });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro ao salvar o projeto' });
        }
    },
    async projectsSavedByUser(req, res) {
        try {
            const { user_id } = req.params;

            const savedProjects = await SavedProject.findAll({
                where: { userid: user_id },
                attributes: ['projectid'],

            });

            if (!savedProjects || savedProjects.length === 0) {
                return res.status(200).send({ message: "Nenhum projeto salvo encontrado para este usuário!" });
            }

            const projectIds = savedProjects.map((savedProject) => savedProject.projectid);

            const projects = await Project.findAll({
                where: { id: projectIds },
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['firstname']
                }
            });

            return res.status(200).send({ projects });
        } catch (err) {
            console.error("Erro ao obter projetos salvos pelo usuário: ", err);
            return res.status(500).send({
                status: 0,
                message: "Erro ao obter projetos salvos pelo usuário"
            });
        }
    },
    async projectThank(req, res) {
        try {
            const { user_id, donor_id } = req.body;

            const existingHandShakedProject = await HandShaked.findOne({ where: { user_id, donor_id } });

            if (existingHandShakedProject) {
                await existingHandShakedProject.destroy();
                res.status(200).json({ message: 'Deixou de agradecer doador com sucesso' });
            } else {
                const [handShakeProject, created] = await HandShaked.findOrCreate({
                    where: { user_id, donor_id },
                    defaults: {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                res.status(200).json({ message: 'Doador agradecido com sucesso', handShakeProject, created });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro ao agradecer doador' });
        }
    },
    async finalizeProject(req, res) {
        try {
            const { projectid } = req.body;
            const project = await Project.findByPk(projectid);

            if (project) {
                project.status = 0;
                await project.save();
                res.status(200).json({ message: 'Projeto finalizado com sucesso' });
            } else {
                return res.status(404).json({ message: 'Projeto não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ocorreu um erro ao finalizar o projeto!' });
        }
    },
    async changeStatusProject(req, res) {
        try {
            const { projectid } = req.body;
            const project = await Project.findByPk(projectid);

            if (project) {
                if (project.status == 0)
                    project.status = 1;
                else
                    project.status = 0;

                await project.save();
                res.status(200).json({ message: 'Projeto alterado com sucesso' });
            } else {
                return res.status(404).json({ message: 'Projeto não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ocorreu um erro ao alterar o projeto!' });
        }
    },
    async addMidia(req, res) {
        try {
            const { project_id, description } = req.body;
            const imageUrls = req.files.map((file) => file.path.replace(/\\/g, '/'));
            const image = imageUrls[0].replace("public/images/", "");

            const midia = await ProjectMidia.create({
                project_id,
                description,
                image: image,
                defaults: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            return res.status(200).json({
                status: 1,
                message: "Midia cadastrada com sucesso!",
                midia
            });

        } catch (err) {
            console.log("Erro: " + err)
            return res.status(400).json({ error: err });
        }
    },
}; 