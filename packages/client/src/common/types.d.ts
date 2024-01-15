import {
	ACTION_GET_DATA,
	ACTION_SET_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_STALE,
	ACTION_STATUS_SUCCESS,
} from "./constants";

export type ShortcutDataProps = {
	id: string;
	label: string;
	url: string;
};

export type ShortcutProps = {
	data: ShortcutDataProps[];
	position: number;
	title: string;
};

export type StateProps = {
	shortcuts: ShortcutProps[];
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
				shortcuts: ShortcutProps[];
				status:
					| string
					| typeof ACTION_STATUS_ERROR
					| typeof ACTION_STATUS_SUCCESS;
			};
			type: typeof ACTION_GET_DATA;
	  }
	| {
			payload: {
				shortcut: ShortcutProps;
				status: typeof ACTION_STATUS_STALE;
			};
			type: typeof ACTION_SET_DATA;
	  };

export type AppContextProps = {
	dispatch: React.Dispatch<ActionProps>;
	state?: StateProps;
};
