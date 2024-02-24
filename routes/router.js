import express from 'express';
import { getAllUsers, signup, login } from '../controllers/user-controller';

const router = express.Router();

router.get('/get',getAllUsers);
router.post('/signup', signup);
router.post('/login',login);


export default router;