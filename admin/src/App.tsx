import { FC } from "react";
import { Button } from "antd";
import "./index.css";

const App: FC = () => {
	return (
		<>
			<Button>Login</Button>
			<h1 className="text-red-500">Admin</h1>
		</>
	);
};

export default App;
