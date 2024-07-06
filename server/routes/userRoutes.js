const {Router} = require("express")
const  {getAuthors, getUser, editUser, loginUser, registerUser, changeAvatar} =require("../controllers/userControllers")
const authMiddleware = require('../middleware/authMiddleware')
const router = Router()

router.post('/register',registerUser) 
router.post('/login',loginUser)
router.get('/:id',getUser)
router.get('/',getAuthors)
router.post('/change-avater',authMiddleware, changeAvatar)
router.patch('/:id', authMiddleware,editUser)

module.exports= router