import { ButtonIcon } from "@versini/ui-button";
import { Header } from "@versini/ui-header";
import { useHotkeys } from "@versini/ui-hooks";
import { IconEdit, IconSearch, IconStarInCircle } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { TextInput } from "@versini/ui-textinput";
import { useContext, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { ACTION_SET_EDIT_SECTIONS } from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { Settings } from "../Settings/Settings";

export const Root = () => {
	const location = useLocation();
	const isShortcuts = location.pathname === "/";
	const title = isShortcuts ? "My Shortcuts" : "My Chat";
	const { state, dispatch } = useContext(AppContext);
	const searchRef = useRef<HTMLInputElement>(null);
	const allShortcutsRef = useRef([]);

	const onSearchChange = (e: {
		preventDefault: () => void;
		target: { value: string | RegExp };
	}) => {
		e.preventDefault();
		const re = new RegExp(e.target.value, "i");
		const all = allShortcutsRef.current;

		all.forEach((node: HTMLDivElement) => {
			if (re.test(node.textContent as string)) {
				node.style.display = "block";
			} else {
				node.style.display = "none";
			}
		});
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	useHotkeys([
		[
			"mod+K",
			() => {
				isShortcuts && searchRef.current && searchRef.current.focus();
			},
		],
	]);

	useEffect(() => {
		if (
			state &&
			state?.sections?.length > 0 &&
			isShortcuts &&
			searchRef.current &&
			allShortcutsRef.current
		) {
			allShortcutsRef.current = Array.from(
				document.querySelectorAll("a.btn-shortcut"),
			);
		}
	}, [isShortcuts, state]);

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
						<Flexgrid columnGap={5}>
							{isShortcuts && (
								<FlexgridItem>
									<form
										autoComplete="off"
										onSubmit={onSubmit}
										className="myl-search"
									>
										<TextInput
											ref={searchRef}
											labelHidden
											noBorder
											focusMode="light"
											size={"xs"}
											name="Search"
											label="Search"
											onChange={onSearchChange}
											rightElement={
												<div className="text-copy-dark">
													<IconSearch monotone className="size-4" />
												</div>
											}
										/>
									</form>
								</FlexgridItem>
							)}
							<FlexgridItem>
								<Settings />
							</FlexgridItem>
						</Flexgrid>
					</FlexgridItem>
				</Flexgrid>
			</Header>
			<Outlet />
		</>
	);
};
