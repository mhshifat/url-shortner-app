import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../context/auth";

const PublicRoute: React.FC<RouteProps> = ({
	component: Component,
	...restProps
}) => {
	const { user } = useAuth();
	return (
		<Route
			{...restProps}
			render={(props) =>
				// @ts-ignore
				!user ? <Component {...props} /> : <Redirect to="/" />
			}
		/>
	);
};

export default PublicRoute;
