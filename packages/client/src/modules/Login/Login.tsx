import { Button, ButtonIcon } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { Header } from "@versini/ui-header";
import { IconHide, IconKey, IconShow } from "@versini/ui-icons";
import { IconStarInCircle } from "@versini/ui-icons";
import { Main } from "@versini/ui-main";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { TextInput, TextInputMask } from "@versini/ui-textinput";
import { useContext, useEffect, useState } from "react";

import { useAuth } from "@versini/auth-provider";
import {
	ACTION_SET_STATUS,
	ACTION_STATUS_SUCCESS,
} from "../../common/constants";
import {
	LOG_IN,
	LOG_IN_PASSKEY,
	PASSWORD_PLACEHOLDER,
} from "../../common/strings";
import { AppContext } from "../App/AppContext";
import { AppFooter } from "../Common/AppFooter";

export const Login = () => {
	const { login, logoutReason, loginWithPasskey } = useAuth();

	const { dispatch } = useContext(AppContext);

	const [errorMessage, setErrorMessage] = useState("");
	const [globalErrorMessage, setGlobalErrorMessage] = useState("");
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const response = await login(simpleLogin.username, simpleLogin.password);
		if (!response) {
			setGlobalErrorMessage("");
			setErrorMessage("Invalid username or password");
		} else {
			dispatch({
				type: ACTION_SET_STATUS,
				payload: {
					status: ACTION_STATUS_SUCCESS,
				},
			});
		}
	};

	useEffect(() => {
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	});

	useEffect(() => {
		if (logoutReason) {
			setGlobalErrorMessage(logoutReason);
		}
	}, [logoutReason]);

	return (
		<>
			<Header mode="dark">
				<h1 className="heading mb-0">
					<Flexgrid alignVertical="center">
						<FlexgridItem>
							<IconStarInCircle className="mr-2" />
						</FlexgridItem>
						<FlexgridItem>My Shortcuts</FlexgridItem>
					</Flexgrid>
				</h1>
			</Header>
			<Main>
				<form className="mt-5" onSubmit={handleLogin}>
					<Flexgrid rowGap={7} alignHorizontal="center">
						<FlexgridItem span={6}>
							<Card mode="dark">
								<FlexgridItem span={12}>
									{globalErrorMessage && (
										<div className="p-2 text-sm text-center text-copy-error-light bg-surface-darker">
											{globalErrorMessage}
										</div>
									)}
								</FlexgridItem>

								<FlexgridItem span={12}>
									<TextInput
										required
										autoCapitalize="off"
										autoComplete="off"
										autoCorrect="off"
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
								<FlexgridItem span={12}>
									<TextInputMask
										required
										autoCapitalize="off"
										autoComplete="off"
										autoCorrect="off"
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
										mode="light"
										focusMode="light"
										fullWidth
										noBorder
										type="submit"
										className="mb-4 mt-6"
									>
										{LOG_IN}
									</Button>
								</FlexgridItem>
							</Card>
						</FlexgridItem>
					</Flexgrid>

					<div className="text-center text-copy-light">or</div>
					<Flexgrid alignHorizontal="center">
						<FlexgridItem span={6}>
							<ButtonIcon
								mode="dark"
								focusMode="light"
								fullWidth
								noBorder
								className="mb-4 mt-1"
								labelRight={LOG_IN_PASSKEY}
								onClick={loginWithPasskey}
							>
								<IconKey className="size-4" />
							</ButtonIcon>
						</FlexgridItem>
					</Flexgrid>
				</form>
			</Main>
			<AppFooter />
		</>
	);
};
