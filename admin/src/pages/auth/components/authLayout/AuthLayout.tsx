import { FC, ReactNode } from "react";
import { Button, Form, FormInstance, Typography } from "antd";

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
	 * Description of the form.
	 */
	description?: string;

	/**
	 * Form items to be displayed.
	 */
	children: ReactNode;

	/**
	 * Use form hook
	 */
	form?: FormInstance;

	/**
	 * Function to be called when form is submitted.
	 * @param values Values of the form.
	 */
	onSubmit?: (values: any) => void;

	/**
	 * Whether the button is loading or not.
	 */
	isButtonLoading?: boolean;
}

/**
 * AuthLayout is a layout component for the auth pages.
 * It has a image on left side with a form on the right side.
 * @constructor
 */
const AuthLayout: FC<AuthLayoutProps> = ({
	image,
	heading,
	description,
	buttonText,
	form,
	onSubmit,
	isButtonLoading,
	children,
}) => {
	return (
		<main className="flex items-center justify-center h-screen">
			<div className="flex flex-col md:flex-row items-center justify-between w-[80%] md:shadow-2xl md:px-10 md:py-20">
				<div className="w-1/2 h-auto">
					<img src={image} alt="Illustration" className="w-full h-full" />
				</div>

				<div className="w-full text-center md:text-left md:w-1/2 md:ml-8 mt-10 md:mt-0">
					<Form layout={"vertical"} form={form} onFinish={onSubmit}>
						<Form.Item>
							<Typography.Title level={3}>{heading}</Typography.Title>

							{description && <Typography.Paragraph>{description}</Typography.Paragraph>}
						</Form.Item>

						{children}

						<Form.Item>
							<Button type={"primary"} onClick={() => form?.submit()} loading={isButtonLoading}>
								{buttonText}
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;
