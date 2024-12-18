import { ButtonIcon } from "@versini/ui-button";
import { Header } from "@versini/ui-header";
import { useHotkeys } from "@versini/ui-hooks";
import {
	IconClose,
	IconEdit,
	IconMessages,
	IconSearch,
	IconStarInCircle,
} from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { TextInput } from "@versini/ui-textinput";
import { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";

import {
	ACTION_SET_EDIT_SECTIONS,
	CARD_SECTION_VISIBLE,
} from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { Settings } from "../Settings/Settings";

export const Root = () => {
	const location = useLocation();
	const isShortcuts = location.pathname === "/";
	const title = isShortcuts ? "My Shortcuts" : "My Chat";

	const { state, dispatch } = useContext(AppContext);

	const searchRef = useRef<HTMLInputElement>(null);
	const allShortcutsRef = useRef([]);

	const [searchString, setSearchString] = useState("");

	const toggleShortcutsVisibility = (value: string) => {
		/**
		 * value is a string that is used to filter the shortcuts.
		 * If the value contains characters that are incompatible with the RegExp
		 * constructor, it will throw an error, so we need to escape them before hand.
		 */
		value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const re = new RegExp(value, "i");
		const all = allShortcutsRef.current;

		all.forEach((node: HTMLDivElement) => {
			if (re.test(node.textContent as string)) {
				node.classList.add(CARD_SECTION_VISIBLE);
			} else {
				node.classList.remove(CARD_SECTION_VISIBLE);
			}
		});
	};

	const onSearchChange = (e: {
		preventDefault: () => void;
		target: { value: string };
	}) => {
		e.preventDefault();
		setSearchString(e.target.value);
		toggleShortcutsVisibility(e.target.value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const onResetSearch = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setSearchString("");
		toggleShortcutsVisibility("");
		if (searchRef.current) {
			searchRef.current.value = "";
			searchRef.current.focus();
		}
	};

	useHotkeys([
		[
			"mod+K",
			() => {
				if (isShortcuts && searchRef.current) {
					searchRef.current.focus();
					searchRef.current.select();
				}
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

	/**
	 * Reset the search string when the user switches between shortcuts and chat.
	 */
	useEffect(() => {
		if (!isShortcuts && searchString !== "") {
			setSearchString("");
		}
	}, [isShortcuts, searchString]);

	return (
		<>
			<Header mode="dark" sticky>
				<Flexgrid alignHorizontal="space-between" alignVertical="center">
					<FlexgridItem>
						<h1 className="heading mb-0">
							<Flexgrid alignVertical="center">
								<FlexgridItem>
									{isShortcuts ? (
										<IconStarInCircle spacing={{ r: 2 }} />
									) : (
										<IconMessages spacing={{ r: 2 }} />
									)}
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
										autoCorrect="off"
										onSubmit={onSubmit}
										className="myl-search"
									>
										<TextInput
											ref={searchRef}
											autoComplete="off"
											autoCorrect="off"
											labelHidden
											noBorder
											focusMode="light"
											size={"xs"}
											name="Search"
											label="Search"
											onChange={onSearchChange}
											rightElement={
												<div className="text-copy-dark">
													<ButtonIcon
														size="small"
														onClick={onResetSearch}
														disabled={searchString === ""}
													>
														{searchString !== "" ? (
															<IconClose monotone className="size-3" />
														) : (
															<IconSearch monotone className="size-3" />
														)}
													</ButtonIcon>
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
