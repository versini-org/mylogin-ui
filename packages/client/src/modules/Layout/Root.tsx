import { ButtonIcon } from "@versini/ui-button";
import { Header } from "@versini/ui-header";
import { IconEdit, IconStarInCircle } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { ACTION_SET_EDIT_SECTIONS } from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { Settings } from "../Settings/Settings";

export const Root = () => {
	const location = useLocation();
	const title = location.pathname === "/" ? "My Shortcuts" : "My Chat";
	const { state, dispatch } = useContext(AppContext);
	return (
		<>
			<Header mode="dark">
				<Flexgrid alignHorizontal="space-between" alignVertical="center">
					<FlexgridItem>
						<h1 className="heading mb-0">
							<Flexgrid alignVertical="center">
								<FlexgridItem>
									<IconStarInCircle spacing={{ r: 2 }} />
								</FlexgridItem>
								<FlexgridItem>{title}</FlexgridItem>
								<FlexgridItem>
									{state && state?.sections?.length > 0 && state.editMode && (
										<ButtonIcon
											spacing={{ l: 2 }}
											noBackground
											focusMode="light"
											mode="light"
											noBorder
											label="Edit all sections"
											onClick={() => {
												dispatch({
													type: ACTION_SET_EDIT_SECTIONS,
													payload: {
														editSections: !state.editSections,
													},
												});
											}}
										>
											<IconEdit />
										</ButtonIcon>
									)}
								</FlexgridItem>
							</Flexgrid>
						</h1>
					</FlexgridItem>
					<FlexgridItem>
						<Settings />
					</FlexgridItem>
				</Flexgrid>
			</Header>
			<Outlet />
		</>
	);
};
