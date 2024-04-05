import {
	ACTION_REFRESH_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
} from "./constants";
import { FAKE_USER_EMAIL } from "./strings";
import {
	addSection,
	addShortcuts,
	changeSectionPosition,
	deleteSection,
	editSectionTitle,
} from "./utilities";

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
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		const data = response.data;
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: [...sections, data],
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

export const onClickChangePosition = async ({
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

export const onClickAddShortcut = async ({
	basicAuth,
	section,
	dispatch,
}: {
	basicAuth: any;
	dispatch: any;
	section: any;
}) => {
	const response = await addShortcuts({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId: section.id,
		sectionTitle: section.title,
		shortcuts: [
			...section.shortcuts,
			{
				label: "New Shortcut",
				url: "https://example.com",
			},
		],
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
