import { FC } from "react";
import loginImg from "../../../assets/illustrations/login.svg";
import { Button, Form, Input, Typography } from "antd";

const Login: FC = () => {
	return (
		<main className="flex items-center justify-center h-screen">
			<div className="flex flex-col md:flex-row items-center justify-between w-[80%] md:shadow-2xl md:px-10 md:py-20">
				<div className="w-1/2 h-auto">
					<img src={loginImg} alt="Illustration" className="w-full h-full" />
				</div>

				<div className="w-full text-center md:text-left md:w-1/2 md:ml-8 mt-10 md:mt-0">
					<Form layout="vertical">
						<Form.Item>
							<Typography.Title level={3}>Welcome Back!</Typography.Title>
						</Form.Item>

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
						<Form.Item>
							<Button type={"primary"}>Login</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</main>
	);
};

export default Login;
