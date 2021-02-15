import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { register } from "../lib/api/auth";

const Register = () => {
	const history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		register({ email, password })
			.then(() => history.push("/login"))
			.catch((err) => console.error(err));
	};

	return (
		<div className="auth">
			<div className="auth__wrapper">
				<h1>Register</h1>
				<p>Register an account to our platform to manage your URLs</p>

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
					<input type="submit" value="Register" />
				</form>
			</div>
		</div>
	);
};

export default Register;
