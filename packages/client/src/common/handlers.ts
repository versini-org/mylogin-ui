import { v4 as uuidv4 } from "uuid";

import {
	ACTION_REFRESH_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
} from "./constants";
import { FAKE_USER_EMAIL } from "./strings";
import type { SectionProps } from "./types";
import {
	addSection,
	changeSectionPosition,
	deleteSection,
	editSectionTitle,
	editShortcuts,
} from "./utilities";

/**
 *
 * Section handlers.
 *
 */
export const onClickAddSection = async ({
	basicAuth,
	dispatch,
	sections,
	position,
}: {
	basicAuth: any;
	dispatch: any;
	position: number;
	sections: any;
}) => {
	const response = await addSection({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		position,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		const newSection = response.data;
		if (position >= 0) {
			sections.splice(position + 1, 0, newSection);
		} else {
			sections.push(newSection);
		}
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections,
			},
		});
	}
};

export const onChangeSectionTitle = async ({
	e,
	section,
	dispatch,
	basicAuth,
	state,
}: {
	basicAuth: any;
	dispatch: any;
	e: any;
	section: any;
	state: any;
}) => {
	const response = await editSectionTitle({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId: section.id,
		sectionTitle: e.target.value,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		const editedSection = response.data;
		const sections = state.sections.map((s: any) => {
			if (s.id === editedSection.id) {
				return editedSection;
			}
			return s;
		});

		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections,
			},
		});
	}
};

export const onClickChangeSectionPosition = async ({
	basicAuth,
	sectionId,
	direction,
	dispatch,
}: {
	basicAuth: any;
	direction: string;
	dispatch: any;
	sectionId: string;
}) => {
	const response = await changeSectionPosition({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId,
		direction,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: response.data,
			},
		});
	}
};

export const onClickDeleteSection = async ({
	dispatch,
	basicAuth,
	section,
}: {
	basicAuth: any;
	dispatch: any;
	section: any;
}) => {
	const response = await deleteSection({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId: section.id,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: response.data,
			},
		});
	}
};

/**
 *
 * Shortcuts handlers.
 *
 */
export const onClickAddShortcut = async ({
	section,
	position,
	basicAuth,
	dispatch,
}: {
	basicAuth: string | boolean;
	dispatch: any;
	position: number | null;
	section: SectionProps | null;
}) => {
	if (section?.shortcuts && position !== null) {
		section.shortcuts.splice(position + 1, 0, {
			id: uuidv4(),
			label: "New Shortcut",
			url: "https://www.example.com",
		});
		const response = await editShortcuts({
			basicAuth,
			userId: FAKE_USER_EMAIL,
			sectionId: section.id,
			sectionTitle: section.title,
			shortcuts: section.shortcuts,
		});
		if (response.status !== 200) {
			dispatch({
				type: ACTION_SET_STATUS,
				payload: {
					status: ACTION_STATUS_ERROR,
				},
			});
		} else {
			dispatch({
				type: ACTION_REFRESH_DATA,
				payload: {
					status: ACTION_STATUS_SUCCESS,
					sections: response.data,
				},
			});
		}
	} else {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	}
};

export const onChangeShortcut = async ({
	label,
	url,
	position,
	section,
	dispatch,
	basicAuth,
}: {
	basicAuth: any;
	dispatch: any;
	position: any;
	section: any;
	label?: string;
	url?: string;
}) => {
	if (label) {
		section.shortcuts[position].label = label;
	}
	if (url) {
		section.shortcuts[position].url = url;
	}
	const response = await editShortcuts({
		basicAuth,
		userId: FAKE_USER_EMAIL,
		sectionId: section.id,
		sectionTitle: section.title,
		shortcuts: section.shortcuts,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: response.data,
			},
		});
	}
};

export const onClickDeleteShortcut = async ({
	section,
	position,
	basicAuth,
	dispatch,
}: {
	basicAuth: string | boolean;
	dispatch: any;
	position: number | null;
	section: SectionProps | null;
}) => {
	if (section && position !== null) {
		section.shortcuts.splice(position, 1);
		const response = await editShortcuts({
			basicAuth,
			userId: FAKE_USER_EMAIL,
			sectionId: section.id,
			sectionTitle: section.title,
			shortcuts: section.shortcuts,
		});
		if (response.status !== 200) {
			dispatch({
				type: ACTION_SET_STATUS,
				payload: {
					status: ACTION_STATUS_ERROR,
				},
			});
		} else {
			dispatch({
				type: ACTION_REFRESH_DATA,
				payload: {
					status: ACTION_STATUS_SUCCESS,
					sections: response.data,
				},
			});
		}
	} else {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	}
};

export const onClickChangeShortcutPosition = async ({
	basicAuth,
	section,
	direction,
	position,
	dispatch,
}: {
	basicAuth: any;
	direction: string;
	dispatch: any;
	position: number;
	section: any;
}) => {
	/**
	 * section.shortcuts is an array of objects. Each object has an id, label, and url.
	 * We need to move the shortcut at the given position in the given direction.
	 */
	const shortcut = section.shortcuts[position];
	if (direction === "up") {
		section.shortcuts[position] = section.shortcuts[position - 1];
		section.shortcuts[position - 1] = shortcut;
	} else if (direction === "down") {
		section.shortcuts[position] = section.shortcuts[position + 1];
		section.shortcuts[position + 1] = shortcut;
	}

	const response = await editShortcuts({
		basicAuth,
		userId: FAKE_USER_EMAIL,
		sectionId: section.id,
		sectionTitle: section.title,
		shortcuts: section.shortcuts,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: response.data,
			},
		});
	}
};
