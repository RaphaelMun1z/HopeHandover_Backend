const express = require('express')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueFileName = `${uuidv4()}${extension}`;
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage: storage });

const UserController = require("../controllers/UserController")
const AddressController = require("../controllers/AddressController")
const ProjectController = require('../controllers/ProjectController')
const DonateController = require('../controllers/DonateController');
const GeneralDataController = require('../controllers/GeneralDataController');

const authMiddleware = require("../middlewares/auth");
const router = express.Router()

// CRUD User
router.get('/adm/users', authMiddleware, UserController.index) 
router.post('/adm/user/changeStatus', authMiddleware, UserController.changeStatusUser) 
router.post('/users', upload.array('image', 1), UserController.store) 
router.patch('/users/:user_id', authMiddleware, UserController.update) 

router.delete('/users/:user_id', authMiddleware, UserController.delete)
router.post('/users/login', UserController.login)
router.get('/checkauth', UserController.checkAuth)
router.post('/logout', authMiddleware, UserController.logout)

router.post('/projects', authMiddleware, upload.array('images', 3), ProjectController.store);
router.get('/projects', ProjectController.index);
router.get('/adm/projects', ProjectController.indexAll);
router.get('/projects/:user_id', ProjectController.indexByUser);
router.patch('/project/edit/:project_id', ProjectController.update);
router.get('/projects/about/:project_id', ProjectController.indexById);
router.post('/project/save', authMiddleware, ProjectController.saveProject);
router.post('/project/finalize', authMiddleware, ProjectController.finalizeProject);
router.post('/adm/project/changeStatus', authMiddleware, ProjectController.changeStatusProject);
router.get('/projects/saved/:user_id', authMiddleware, ProjectController.projectsSavedByUser);
router.post('/project/thank', authMiddleware, ProjectController.projectThank);
router.post('/project/addMidia', authMiddleware, upload.array('image', 1), ProjectController.addMidia);

router.get('/myAddresses/:user_id', authMiddleware, AddressController.index);
router.post('/createAddress', authMiddleware, AddressController.store);
router.delete('/address/create/:id', authMiddleware, AddressController.delete);
router.put('/address/create/:id', authMiddleware, AddressController.update);

router.post('/createDonate', authMiddleware, upload.array('image', 1), DonateController.create);
router.get('/donates', DonateController.index);
router.get('/peopleDonor', DonateController.indexPeopleDonor);
router.get('/companyDonor', DonateController.indexCompanyDonor);
router.post('/realizeDonate', authMiddleware, DonateController.completeDonation);
router.get('/donates/:user_id', authMiddleware, DonateController.indexDonateByUser);
router.get('/givedDonates/:user_id', authMiddleware, DonateController.indexDonatesRealizedByUser);
router.get('/acknowledgment/:user_id', authMiddleware, DonateController.indexAcknowledgmentByUser);
router.post('/statusChange', authMiddleware, DonateController.updateStatusDonated);
router.post('/donorUserData/:user_id', authMiddleware, DonateController.getDonorData);

router.post('/contact', GeneralDataController.store);

module.exports = router