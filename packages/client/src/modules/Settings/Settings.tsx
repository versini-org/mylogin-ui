import { useAuth } from "@versini/auth-provider";
import {
	ButtonIcon,
	Menu,
	MenuItem,
	MenuSeparator,
} from "@versini/ui-components";
import { IconBack, IconEdit, IconSettings } from "@versini/ui-icons";
import { useContext, useState } from "react";
import { ACTION_SET_EDIT_MODE } from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";

export const Settings = () => {
	const { logout } = useAuth();
	const { state, dispatch } = useContext(AppContext);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const onClickConfirmLogout = () => {
		console.info("Log out");
		setShowConfirmation(!showConfirmation);
	};

	const onClickToggleEditMode = () => {
		console.info("Toggle edit mode");
		dispatch({
			type: ACTION_SET_EDIT_MODE,
			payload: {
				editMode: !state.editMode,
			},
		});
	};

	return (
		<>
			<ConfirmationPanel
				showConfirmation={showConfirmation}
				setShowConfirmation={setShowConfirmation}
				action={logout}
				customStrings={{
					confirmAction: "Log out",
					cancelAction: "Cancel",
					title: "Log out",
				}}
			>
				<p>Are you sure you want to log out?</p>
			</ConfirmationPanel>

			<Menu
				mode="dark"
				focusMode="light"
				trigger={
					<ButtonIcon noBorder>
						<IconSettings />
					</ButtonIcon>
				}
				defaultPlacement="bottom-end"
			>
				<MenuItem
					label="Toggle edit mode"
					onClick={onClickToggleEditMode}
					icon={<IconEdit />}
				/>
				<MenuSeparator />
				<MenuItem
					label="Log out"
					onClick={onClickConfirmLogout}
					icon={
						<div className="text-red-700">
							<IconBack monotone />
						</div>
					}
				/>
			</Menu>
		</>
	);
};
