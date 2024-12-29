import {Request, Response, Router} from "express"
import bcrypt from "bcrypt"
import jwt, {JwtPayload} from "jsonwebtoken"
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

router.post("/api/user/login", async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const loginUser = users.find((user) => user.email === email);
    if (!loginUser) {
        res.status(401).json({ message: 'Login failed.' });
        return 
    }

    if (!bcrypt.compareSync(password, loginUser.password)) {
        res.status(401).json({ message: 'Login failed.' });
        return
    }

    const jwtPayload: JwtPayload = {
        email: email
    }
    const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "2m"})

    res.status(200).json({success: true, token})  
    return
})

export default router