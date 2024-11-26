import {
	ACTION_INVALIDATE_SESSION,
	ACTION_REFRESH_DATA,
	ACTION_SET_EDIT_MODE,
	ACTION_SET_EDIT_SECTIONS,
	ACTION_SET_STATUS,
} from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const reducer = (state: StateProps, action: ActionProps) => {
	if (action?.type === ACTION_SET_STATUS) {
		return {
			status: action.payload.status,

			sections: state.sections,
			editMode: state.editMode,
			editSections: state.editSections,
		};
	}

	if (action?.type === ACTION_REFRESH_DATA) {
		return {
			status: action.payload.status,
			sections: action.payload.sections,

			editMode: state.editMode,
			editSections: state.editSections,
		};
	}

	if (action?.type === ACTION_INVALIDATE_SESSION) {
		return {
			status: action.payload.status,

			sections: state.sections,
			editMode: state.editMode,
			editSections: state.editSections,
		};
	}

	if (action?.type === ACTION_SET_EDIT_MODE) {
		/**
		 * If the edit mode is disabled, reset the edit sections.
		 */
		const editSections = action.payload.editMode ? state.editSections : false;
		return {
			editMode: action.payload.editMode,

			editSections,
			sections: state.sections,
			status: state.status,
		};
	}

	if (action?.type === ACTION_SET_EDIT_SECTIONS) {
		return {
			editSections: action.payload.editSections,

			editMode: state.editMode,
			sections: state.sections,
			status: state.status,
		};
	}

	return state;
};
