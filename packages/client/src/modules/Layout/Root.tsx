import { isGranted, useAuth } from "@versini/auth-provider";
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
	ACTION_SET_EDIT_MODE,
	ACTION_SET_EDIT_SECTIONS,
	CARD_SECTION_VISIBLE,
	GRANTS,
} from "../../common/constants";
import { AppContext } from "../App/AppContext";
import { Settings } from "../Settings/Settings";

export const Root = () => {
	const { getAccessToken } = useAuth();
	const location = useLocation();
	const isShortcuts = location.pathname === "/";
	const title = isShortcuts ? "My Shortcuts" : "My Chat";

	const { state, dispatch } = useContext(AppContext);

	const searchRef = useRef<HTMLInputElement>(null);
	const allShortcutsRef = useRef([]);
	const isEditGrantedRef = useRef(false);
	const effectToGetGrantsDidRun = useRef(false);

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
		[
			"mod+E",
			() => {
				if (state && isEditGrantedRef.current) {
					dispatch({
						type: ACTION_SET_EDIT_MODE,
						payload: {
							editMode: !state.editMode,
						},
					});
				}
			},
		],
	]);

	/**
	 * Check if the user has the required grants to edit shortcuts.
	 * This is the first line of defense to enforce policies.
	 * The second line is the server-side validation which
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
				}
			} catch (error) {
				console.error("Failed to fetch token or check grants:", error);
			}
		})();
		return () => {
			effectToGetGrantsDidRun.current = true;
		};
	}, [getAccessToken]);

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
										<IconStarInCircle className="mr-2" />
									) : (
										<IconMessages className="mr-2" />
									)}
								</FlexgridItem>
								<FlexgridItem>{title}</FlexgridItem>

								<FlexgridItem>
									{state && state?.sections?.length > 0 && state.editMode && (
										<ButtonIcon
											className="ml-2"
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
															<IconClose monotone size="size-3" />
														) : (
															<IconSearch monotone size="size-3" />
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
