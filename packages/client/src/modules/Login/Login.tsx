import {
	Button,
	Flexgrid,
	FlexgridItem,
	TextInputMask,
} from "@versini/ui-components";
import { useState } from "react";

import { LOCAL_STORAGE_BASIC_AUTH } from "../../common/constants";
import type { StorageInterface } from "../../common/hooks";
import {
	FAKE_USER_EMAIL,
	LOG_IN,
	PASSWORD_PLACEHOLDER,
} from "../../common/strings";

export const Login = ({
	storage,
	errorMessage,
	setErrorMessage,
	setBasicAuth,
}: {
	errorMessage: string;
	setBasicAuth: (basicAuth: string | boolean) => void;
	setErrorMessage: (errorMessage: string) => void;
	storage: StorageInterface;
}) => {
	const [simpleLogin, setSimpleLogin] = useState({
		password: "",
	});

	return (
		<form className="mx-auto">
			<Flexgrid direction="column" width="24rem">
				<FlexgridItem>
					<TextInputMask
						name="password"
						label={PASSWORD_PLACEHOLDER}
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
						fullWidth
						noBorder
						type="submit"
						className="mb-4 mt-6"
						onClick={(e) => {
							e.preventDefault();
							const data = `${btoa(
								`${FAKE_USER_EMAIL}:${simpleLogin.password}`,
							)}`;
							storage.set(LOCAL_STORAGE_BASIC_AUTH, data);
							setBasicAuth(storage.get(LOCAL_STORAGE_BASIC_AUTH));
						}}
					>
						{LOG_IN}
					</Button>
				</FlexgridItem>
			</Flexgrid>
		</form>
	);
};
