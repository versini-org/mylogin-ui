import { Button, ButtonIcon } from "@versini/ui-components";
import { TextInput, TextInputMask } from "@versini/ui-form";
import { IconHide, IconShow } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useState } from "react";

import { useAuth } from "../../common/auth";
import { LOG_IN, PASSWORD_PLACEHOLDER } from "../../common/strings";

export const Login = ({
	errorMessage,
	setErrorMessage,
}: {
	errorMessage: string;
	setErrorMessage: (errorMessage: string) => void;
}) => {
	const auth = useAuth();
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		username: "",
		password: "",
	});

	return (
		<form className="mx-auto mt-8">
			<Flexgrid direction="column" width="36rem" rowGap={7}>
				<FlexgridItem>
					<TextInput
						mode="dark"
						focusMode="light"
						name="username"
						label="Username"
						onChange={(e) => {
							setSimpleLogin({
								...simpleLogin,
								username: e.target.value,
							});
							setErrorMessage("");
						}}
						error={errorMessage !== ""}
					/>
				</FlexgridItem>
				<FlexgridItem>
					<TextInputMask
						mode="dark"
						focusMode="light"
						name="password"
						label={PASSWORD_PLACEHOLDER}
						rightElement={
							<ButtonIcon focusMode="light">
								{masked ? <IconShow /> : <IconHide />}
							</ButtonIcon>
						}
						onMaskChange={setMasked}
						onChange={(e) => {
							setSimpleLogin({
								...simpleLogin,
								password: e.target.value,
							});
							setErrorMessage("");
						}}
						error={errorMessage !== ""}
						helperText={errorMessage}
					/>
				</FlexgridItem>

				<FlexgridItem span={12}>
					<Button
						focusMode="light"
						fullWidth
						noBorder
						type="submit"
						className="mb-4 mt-6"
						onClick={async (e) => {
							e.preventDefault();
							const response = await auth.login(
								simpleLogin.username,
								simpleLogin.password,
							);
							if (!response) {
								setErrorMessage("Invalid username or password");
							}
						}}
					>
						{LOG_IN}
					</Button>
				</FlexgridItem>
			</Flexgrid>
		</form>
	);
};
