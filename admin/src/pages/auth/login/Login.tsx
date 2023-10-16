import { FC } from "react";
import loginImg from "../../../assets/illustrations/login.svg";
import { Form, Input } from "antd";
import AuthLayout from "../components/authLayout/AuthLayout.tsx";

const Login: FC = () => {
	return (
		<AuthLayout image={loginImg} heading={"Welcome Back!"} buttonText={"Login"}>
			<Form.Item
				label="Email/Phone:"
				name="emailPhone"
				rules={[{ required: true, message: "Please input your email or phone" }]}
			>
				<Input placeholder="email@example.com" />
			</Form.Item>

			<Form.Item
				label={"Password"}
				name={"password"}
				rules={[{ required: true, message: "Please input your password" }]}
			>
				<Input.Password placeholder="password" />
			</Form.Item>
		</AuthLayout>
	);
};

export default Login;
