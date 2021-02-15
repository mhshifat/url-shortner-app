import "@mhshifat/env-types-gen";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import auth from "./middlewares/auth";
import Shortner from "./models/Shortner";
import User from "./models/User";

const app = express();
app.use(
	cors({
		credentials: true,
		optionsSuccessStatus: 200,
		origin: process.env.CORS_ORIGIN,
	})
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => res.send("APIs for an url shortner app."));

app.post("/register", async (req, res) => {
	const { email, password } = req.body;
	const user = new User({ email, password: await bcrypt.hash(password, 10) });
	await user.save();
	delete (user as any)._doc.password;
	return res.status(200).json(user);
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) throw new Error("Wrong credentials");
	const isPwdMatched = await bcrypt.compare(password, (user as any).password);
	if (!isPwdMatched) throw new Error("Wrong credentials");
	const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET!);
	res.set(
		"Set-Cookie",
		cookie.serialize("tid", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 3600,
		})
	);
	delete (user as any)._doc.password;
	return res.status(200).json(user);
});

app.get("/logout", auth, async (_, res) => {
	res.set(
		"Set-Cookie",
		cookie.serialize("tid", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			expires: new Date(0),
		})
	);
	return res.status(200).json({ success: true });
});

app.get("/me", auth, async (_, res) => {
	return res.status(200).json(res.locals.user);
});

app.get("/urls", auth, async (_, res) => {
	const urls = await Shortner.find({ owner: res.locals.user._id });
	return res.status(200).json(urls);
});

app.get("/:shortendUrl", async (req, res) => {
	const shortendUrl = req.params.shortendUrl;
	const shortner = await Shortner.findOne({ shortedUrl: shortendUrl });
	if (!shortner) throw new Error("Url not found");
	return res.status(200).redirect((shortner as any).url);
});

app.post("/shorten", auth, async (req, res) => {
	const url = req.body.url;
	const shortedUrl = shortenTheUrl();
	const shortner = new Shortner({
		url,
		shortedUrl,
		owner: res.locals.user._id,
	});
	await shortner.save();
	return res.status(200).json(shortner);
});

app.get("/shortne/:id", auth, async (req, res) => {
	const shortnerId = req.params.id;
	const shortner = await Shortner.findOne({
		_id: shortnerId,
		owner: res.locals.user._id,
	});
	if (!shortner) throw new Error("Url not found");
	return res.status(200).redirect((shortner as any).url);
});

app.put("/shortne/:id", auth, async (req, res) => {
	const shortnerId = req.params.id;
	const url = req.body.url;

	const shortedUrl = shortenTheUrl();
	const shortner = await Shortner.findOneAndUpdate(
		{
			_id: shortnerId,
			owner: res.locals.user._id,
		},
		{
			url,
			shortedUrl,
		}
	);
	return res.status(200).json(shortner);
});

app.delete("/shortne/:id", auth, async (req, res) => {
	const shortnerId = req.params.id;
	const shortner = await Shortner.findOneAndRemove({
		_id: shortnerId,
		owner: res.locals.user._id,
	});
	return res.status(200).json(shortner);
});

mongoose
	.connect(process.env.MONGODB_URI!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
	})
	.then(() => {
		console.log("🔥  Database connected!");
		return app.listen(process.env.PORT);
	})
	.then(() => {
		console.log(
			`🚀  The server is running on http://localhost:${process.env.PORT}`
		);
	})
	.catch((err) => console.error(err));

function shortenTheUrl() {
	// I generate the UID from two parts here
	// to ensure the random number provide enough bits.
	let firstPart: string | number = (Math.random() * 46656) | 0;
	let secondPart: string | number = (Math.random() * 46656) | 0;
	firstPart = ("000" + firstPart.toString(36)).slice(-3);
	secondPart = ("000" + secondPart.toString(36)).slice(-3);
	return firstPart + secondPart;
}
