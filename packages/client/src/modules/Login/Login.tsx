import { Button, ButtonIcon } from "@versini/ui-components";
import { TextInputMask } from "@versini/ui-form";
import { IconHide, IconShow } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
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
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		password: "",
	});

	return (
		<form className="mx-auto">
			<Flexgrid direction="column" width="24rem">
				<FlexgridItem>
					<TextInputMask
						focusMode="light"
						name="password"
						label={PASSWORD_PLACEHOLDER}
						rightElement={
							<ButtonIcon>{masked ? <IconShow /> : <IconHide />}</ButtonIcon>
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
						className="mb-4 mt-8"
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
