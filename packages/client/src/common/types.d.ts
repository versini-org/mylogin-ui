import {
	ACTION_GET_DATA,
	ACTION_SET_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_STALE,
	ACTION_STATUS_SUCCESS,
} from "./constants";

export type ShortcutDataProps = {
	label: string;
	url: string;
};

export type SectionProps = {
	id: string;
	shortcuts: ShortcutDataProps[];
	title: string;
};

export type StateProps = {
	sections: SectionProps[];
	status:
		| string
		| typeof ACTION_STATUS_STALE
		| typeof ACTION_STATUS_ERROR
		| typeof ACTION_STATUS_SUCCESS;
};

export type ActionProps =
	| undefined
	| {
			payload: {
				status:
					| typeof ACTION_STATUS_STALE
					| typeof ACTION_STATUS_ERROR
					| typeof ACTION_STATUS_SUCCESS;
			};
			type: typeof ACTION_SET_STATUS;
	  }
	| {
			payload: {
				sections: SectionProps[];
				status:
					| string
					| typeof ACTION_STATUS_ERROR
					| typeof ACTION_STATUS_SUCCESS;
			};
			type: typeof ACTION_GET_DATA;
	  }
	| {
			payload: {
				section: SectionProps;
				status: typeof ACTION_STATUS_STALE;
			};
			type: typeof ACTION_SET_DATA;
	  };

export type AppContextProps = {
	dispatch: React.Dispatch<ActionProps>;
	state?: StateProps;
};
