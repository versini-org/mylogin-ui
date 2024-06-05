import { Button, ButtonIcon } from "@versini/ui-components";
import { TextInput, TextInputMask } from "@versini/ui-form";
import { useLocalStorage } from "@versini/ui-hooks";
import { IconHide, IconShow } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useState } from "react";

import {
	LOCAL_STORAGE_BASIC_AUTH,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { LOG_IN, PASSWORD_PLACEHOLDER } from "../../common/strings";
import { authenticate } from "../../common/utilities";

export const Login = ({
	errorMessage,
	setErrorMessage,
}: {
	errorMessage: string;
	setErrorMessage: (errorMessage: string) => void;
}) => {
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		username: "",
		password: "",
	});

	const [, setBasicAuth] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_BASIC_AUTH,
		defaultValue: "",
	});

	return (
		<form className="mx-auto mt-8">
			<Flexgrid direction="column" width="24rem" rowGap={7}>
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
						className="mb-4 mt-4"
						onClick={async (e) => {
							e.preventDefault();
							console.info("Login");

							const response = await authenticate({
								username: simpleLogin.username,
								password: simpleLogin.password,
							});
							if (response.data?.token) {
								console.info("Login success");
								setBasicAuth({
									id: response.data.id,
									token: response.data.token,
								});
							} else {
								console.error("Login failed");
								setErrorMessage("Invalid username or password");
							}
							console.info(`==> [${Date.now()}] : `, response);
						}}
						// onClick={(e) => {
						// 	e.preventDefault();
						// 	const data = `${btoa(
						// 		`${FAKE_USER_EMAIL}:${simpleLogin.password}`,
						// 	)}`;
						// 	storage.set(LOCAL_STORAGE_BASIC_AUTH, data);
						// 	setBasicAuth(storage.get(LOCAL_STORAGE_BASIC_AUTH));
						// }}
					>
						{LOG_IN}
					</Button>
				</FlexgridItem>
			</Flexgrid>
		</form>
	);
};
