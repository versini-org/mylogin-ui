import { useAuth } from "@versini/auth-provider";
import {
	ButtonIcon,
	Menu,
	MenuItem,
	MenuSeparator,
} from "@versini/ui-components";
import { IconBack, IconEdit, IconSettings } from "@versini/ui-icons";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ACTION_SET_EDIT_MODE } from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";

export const Settings = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { state, dispatch } = useContext(AppContext);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const onClickConfirmLogout = () => {
		setShowConfirmation(!showConfirmation);
	};

	const onClickToggleEditMode = () => {
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
				{location.pathname === "/" ? (
					<>
						<MenuItem
							label="Sassy Saint"
							onClick={() => {
								navigate("/chat");
							}}
						/>
						<MenuSeparator />
						<MenuItem
							label="Toggle edit mode"
							onClick={onClickToggleEditMode}
							icon={<IconEdit />}
						/>
					</>
				) : (
					<MenuItem
						label="My Shortcuts"
						onClick={() => {
							navigate("/");
						}}
					/>
				)}

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
