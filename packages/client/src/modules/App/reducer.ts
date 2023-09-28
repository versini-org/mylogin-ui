import {
	ACTION_GET_DATA,
	ACTION_SET_DATA,
	ACTION_SET_STATUS,
} from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const reducer = (state: StateProps, action: ActionProps) => {
	if (action?.type === ACTION_SET_STATUS) {
		return {
			status: action.payload.status,
			shortcuts: state.shortcuts,
		};
	}

	if (action?.type === ACTION_GET_DATA) {
		return {
			status: action.payload.status,
			shortcuts: action.payload.shortcuts,
		};
	}

	if (action?.type === ACTION_SET_DATA) {
		const newState = state.shortcuts.map((shortcut) => {
			if (shortcut.position === action.payload.shortcut.position) {
				return action.payload.shortcut;
			}
			return shortcut;
		});
		return {
			status: action.payload.status,
			shortcuts: newState,
		};
	}

	return state;
};
