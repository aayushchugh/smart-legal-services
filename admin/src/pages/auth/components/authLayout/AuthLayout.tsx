import { FC } from "react";
import { Button, Form, Typography } from "antd";

interface AuthLayoutProps {
	/**
	 * Image to be displayed on the left side of the layout.
	 */
	image: string;

	/**
	 * Heading of the form.
	 */
	heading: string;

	/**
	 * Text to be displayed on the button.
	 */
	buttonText: string;

	/**
	 * Form items to be displayed.
	 */
	children: JSX.Element;
}

/**
 * AuthLayout is a layout component for the auth pages.
 * It has a image on left side with a form on the right side.
 * @constructor
 */
const AuthLayout: FC<AuthLayoutProps> = ({ image, heading, buttonText, children }) => {
	return (
		<main className="flex items-center justify-center h-screen">
			<div className="flex flex-col md:flex-row items-center justify-between w-[80%] md:shadow-2xl md:px-10 md:py-20">
				<div className="w-1/2 h-auto">
					<img src={image} alt="Illustration" className="w-full h-full" />
				</div>

				<div className="w-full text-center md:text-left md:w-1/2 md:ml-8 mt-10 md:mt-0">
					<Form layout={"vertical"}>
						<Form.Item>
							<Typography.Title level={3}>{heading}</Typography.Title>
						</Form.Item>

						{children}

						<Form.Item>
							<Button type={"primary"}>{buttonText}</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;
