import { Button, ButtonIcon, Main } from "@versini/ui-components";
import { TextInput, TextInputMask } from "@versini/ui-form";
import { IconHide, IconShow } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext, useEffect, useState } from "react";

import {
	ACTION_SET_STATUS,
	ACTION_STATUS_SUCCESS,
} from "../../common/constants";
import { LOG_IN, PASSWORD_PLACEHOLDER } from "../../common/strings";
import { AppContext } from "../App/AppContext";
import { useAuth } from "../AuthProvider";
import { AppFooter } from "../Common/AppFooter";
import { AppHeader } from "../Common/AppHeader";

export const Login = () => {
	const { login, logoutReason } = useAuth();

	const { dispatch } = useContext(AppContext);

	const [errorMessage, setErrorMessage] = useState("");
	const [globalErrorMessage, setGlobalErrorMessage] = useState("");
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		username: "",
		password: "",
	});

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
			<AppHeader />
			<Main>
				<form className="mx-auto">
					<Flexgrid rowGap={7} width="350px">
						<FlexgridItem span={12}>
							{globalErrorMessage && (
								<div className="p-2 text-sm text-center text-copy-error-light bg-surface-darker">
									{globalErrorMessage}
								</div>
							)}
						</FlexgridItem>

						<FlexgridItem span={12}>
							<TextInput
								autoCapitalize="off"
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
									const response = await login(
										simpleLogin.username,
										simpleLogin.password,
									);
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
								}}
							>
								{LOG_IN}
							</Button>
						</FlexgridItem>
					</Flexgrid>
				</form>
			</Main>
			<AppFooter />
		</>
	);
};
