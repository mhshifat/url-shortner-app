import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.tid;
	if (!token) return res.status(200).json(null);
	const isValidToken = jwt.verify(token, process.env.JWT_SECRET!);
	if (!isValidToken) return res.status(403).json({ error: "Invalid token" });
	const user = await User.findById((isValidToken as any).uid);
	if (!user) return res.status(200).json(null);
	res.locals.user = user;
	next();
};
