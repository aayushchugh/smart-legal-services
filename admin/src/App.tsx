import { FC } from "react";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login/Login.tsx";

const App: FC = () => {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
