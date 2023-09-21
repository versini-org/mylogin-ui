import { ACTION_DATA } from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const reducer = (state: StateProps, action: ActionProps) => {
	if (action?.type === ACTION_DATA) {
		return {
			shortcuts: action.payload.shortcuts,
		};
	}
	return state;
};
