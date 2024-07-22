import { isGranted, useAuth } from "@versini/auth-provider";
import {
	ButtonIcon,
	Menu,
	MenuItem,
	MenuSeparator,
} from "@versini/ui-components";
import { IconBack, IconEdit, IconSettings } from "@versini/ui-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ACTION_SET_EDIT_MODE, GRANTS } from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";

export const Settings = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout, getAccessToken } = useAuth();
	const { state, dispatch } = useContext(AppContext);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const isEditGrantedRef = useRef(false);
	const isSassyGrantedRef = useRef(false);
	const effectToGetGrantsDidRun = useRef(false);

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

	/**
	 * Check if the user has the required grants to either edit shortcuts,
	 * or use the Sassy Saint chat. This is the first line of defense to
	 * enforce policies. The second line is the server-side validation which
	 * is doing the same checks, but cannot be modified by the client.
	 */
	useEffect(() => {
		if (effectToGetGrantsDidRun.current) {
			return;
		}
		(async () => {
			try {
				const token = await getAccessToken();
				if (token) {
					isEditGrantedRef.current = await isGranted(token, [GRANTS.EDIT]);
					isSassyGrantedRef.current = await isGranted(token, [GRANTS.SASSY]);
				}
			} catch (error) {
				console.error("Failed to fetch token or check grants:", error);
			}
		})();
		return () => {
			effectToGetGrantsDidRun.current = true;
		};
	}, [getAccessToken]);

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
						{isSassyGrantedRef.current && (
							<>
								<MenuItem
									label="Sassy Saint"
									onClick={() => {
										navigate("/chat");
									}}
								/>
								<MenuSeparator />
							</>
						)}

						{isEditGrantedRef.current && (
							<>
								<MenuItem
									label="Toggle edit mode"
									onClick={onClickToggleEditMode}
									icon={<IconEdit />}
								/>
								<MenuSeparator />
							</>
						)}
					</>
				) : (
					<MenuItem
						label="My Shortcuts"
						onClick={() => {
							navigate("/");
						}}
					/>
				)}

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
