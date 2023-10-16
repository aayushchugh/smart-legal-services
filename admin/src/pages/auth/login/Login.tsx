import { FC, useState } from "react";
import loginImg from "../../../assets/illustrations/login.svg";
import { Form, Input, message } from "antd";
import AuthLayout from "../components/authLayout/AuthLayout.tsx";
import API from "../../../api/api.ts";
import { useNavigate } from "react-router-dom";

interface FormValues {
	emailPhone: string;
	password: string;
}

const Login: FC = () => {
	const navigate = useNavigate();
	const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

	const onSubmit = async (values: FormValues) => {
		try {
			setIsLoginLoading(true);

			await API.post("/auth/login", values);
			navigate(`/login/verify?emailPhone=${values.emailPhone}`);
		} catch (err) {
			const { error } = err?.data;

			if (error === "APP_INVALID_CREDS") {
				message.error("Invalid credentials");
			} else if (error === "APP_USER_BLOCKED") {
				message.error("User is blocked");
			}
		} finally {
			setIsLoginLoading(false);
		}
	};

	const [form] = Form.useForm<FormValues>();

	return (
		<AuthLayout
			image={loginImg}
			heading={"Welcome Back!"}
			buttonText={"Login"}
			form={form}
			onSubmit={onSubmit}
			isButtonLoading={isLoginLoading}
		>
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
