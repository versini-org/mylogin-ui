import {
	ACTION_INVALIDATE_SESSION,
	ACTION_REFRESH_DATA,
	ACTION_SET_EDIT_MODE,
	ACTION_SET_STATUS,
} from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const reducer = (state: StateProps, action: ActionProps) => {
	if (action?.type === ACTION_SET_STATUS) {
		return {
			status: action.payload.status,
			sections: state.sections,
			editMode: state.editMode,
		};
	}

	if (action?.type === ACTION_REFRESH_DATA) {
		return {
			status: action.payload.status,
			sections: action.payload.sections,
			editMode: state.editMode,
		};
	}

	if (action?.type === ACTION_INVALIDATE_SESSION) {
		return {
			status: action.payload.status,
			sections: state.sections,
			editMode: state.editMode,
		};
	}

	if (action?.type === ACTION_SET_EDIT_MODE) {
		return {
			editMode: action.payload.editMode,
			sections: state.sections,
			status: state.status,
		};
	}

	return state;
};
