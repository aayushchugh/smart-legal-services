import { FC } from "react";
import verifyLoginImg from "../../../assets/illustrations/loginVerify.svg";
import AuthLayout from "../components/authLayout/AuthLayout.tsx";
import { Form, InputNumber } from "antd";

const VerifyLogin: FC = () => {
	return (
		<AuthLayout
			image={verifyLoginImg}
			heading={"Verify your self"}
			buttonText={"Verify"}
			description={
				"An OTP has been sent to your registered email. Please enter that OTP to verify yourself"
			}
		>
			<Form.Item
				label={"OTP:"}
				name={"otp"}
				rules={[{ required: true, message: "Please enter OTP" }]}
			>
				<InputNumber placeholder={"123456"} className={"w-full"} />
			</Form.Item>
		</AuthLayout>
	);
};

export default VerifyLogin;
