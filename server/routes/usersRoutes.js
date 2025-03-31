import express from 'express'
import { setBestScore, getUserScore } from '../controllers/usersController.js'

const router = express.Router()

router.post('/getScore', getUserScore);
router.post('/setScore', setBestScore);


export { router as usersRoutes }