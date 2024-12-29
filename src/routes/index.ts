import {Request, Response, Router} from "express"
import bcrypt from "bcrypt"
import { compile } from "morgan"

const router: Router = Router()

let users: {email: string, password: string}[] = [];

router.post("/api/user/register", async (req: Request, res: Response) => {
    const {email, password} = req.body;

    // Check if the email is already taken
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        res.status(403).json({ message: 'Email is already in use.' });
        return 
    }

    const salt: string = bcrypt.genSaltSync(10);
    const hash: string = bcrypt.hashSync(password, salt);

    const newUser = { email, password: hash };
    users.push(newUser);

    res.status(200).json(newUser);
    return
})

router.get('/api/user/list', (req: Request, res: Response) => {
    res.status(200).json(users);
})

export default router