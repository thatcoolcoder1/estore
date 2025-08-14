//authControllers

import type { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
    const { User, Password } = req.body;
    console.log(User, Password);
    res.json({ message: "Login received", User, Password });
};

export const register = (req: Request, res: Response) => {
    const { User, Password } = req.body;
    console.log(User, Password);
    res.json({ message: "Register received", User, Password });
};
