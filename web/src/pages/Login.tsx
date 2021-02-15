import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/auth";

const Login = () => {
	const history = useHistory();
	const { loginUser } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		loginUser?.({ email, password })
			.then((user) => {
				console.log(user);
				history.push("/");
			})
			.catch((err) => console.error(err));
	};

	return (
		<div className="auth">
			<div className="auth__wrapper">
				<h1>Login</h1>
				<p>Login to our platform to manage your URLs</p>

				<form onSubmit={handleSubmit} className="auth__form">
					<input
						type="text"
						placeholder="Email"
						value={email}
						onChange={({ target }) => setEmail(target.value)}
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
					<input type="submit" value="Login" />
				</form>
			</div>
		</div>
	);
};

export default Login;
