import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch } from "react-router-dom";
import { SWRConfig } from "swr";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/auth";
import "./index.css";
import axios from "./lib/axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<SWRConfig value={{ fetcher }}>
				<BrowserRouter>
					<Navbar />
					<main>
						<Switch>
							<ProtectedRoute exact path="/" component={Home} />
							<PublicRoute path="/login" component={Login} />
							<PublicRoute path="/register" component={Register} />
						</Switch>
					</main>
				</BrowserRouter>
			</SWRConfig>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
