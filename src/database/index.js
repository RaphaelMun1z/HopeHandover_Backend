const Sequelize = require('sequelize');
const dbConfig = require("../config/database");

const User = require("../models/user")
const Address = require("../models/address")
const Project = require("../models/project")
const SavedProject = require("../models/savedproject")
const Donate = require("../models/donate");
const HandShaked = require('../models/handshaked');
const RealizedDonate = require('../models/realizeddonate'); 
const QuestionContact = require('../models/questioncontact');
const ProjectMidia = require('../models/projectmidia');

const connection = new Sequelize(dbConfig.development);

User.init(connection)
Address.init(connection)
Project.init(connection)
SavedProject.init(connection)
Donate.init(connection)
HandShaked.init(connection)
RealizedDonate.init(connection)
QuestionContact.init(connection)
ProjectMidia.init(connection)

User.associate(connection.models)
Address.associate(connection.models)
Project.associate(connection.models)
SavedProject.associate(connection.models)
Donate.associate(connection.models)
HandShaked.associate(connection.models)
RealizedDonate.associate(connection.models)
QuestionContact.associate(connection.models)
ProjectMidia.associate(connection.models)

module.exports = connection
