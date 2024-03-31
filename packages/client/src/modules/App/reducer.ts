import { ACTION_REFRESH_DATA, ACTION_SET_STATUS } from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const reducer = (state: StateProps, action: ActionProps) => {
	if (action?.type === ACTION_SET_STATUS) {
		return {
			status: action.payload.status,
			sections: state.sections,
		};
	}

	if (action?.type === ACTION_REFRESH_DATA) {
		return {
			status: action.payload.status,
			sections: action.payload.sections,
		};
	}

	return state;
};
