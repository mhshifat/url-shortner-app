import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const Navbar = () => {
	const { user, logoutUser } = useAuth();

	return (
		<nav className="navbar">
			<div className="navbar__logo">
				<span>URL</span> Shortner
			</div>

			<ul className="navbar__nav">
				{user ? (
					<Fragment>
						<li className="navbar__item">
							<span onClick={logoutUser}>Logout</span>
						</li>
					</Fragment>
				) : (
					<Fragment>
						<li className="navbar__item">
							<Link to="/login">Login</Link>
						</li>
						<li className="navbar__item">
							<Link to="/register">Register</Link>
						</li>
					</Fragment>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;
