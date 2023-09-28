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
	position: number;
	title: string;
	data: ShortcutDataProps[];
};

export type StateProps = {
	status:
		| string
		| typeof ACTION_STATUS_STALE
		| typeof ACTION_STATUS_ERROR
		| typeof ACTION_STATUS_SUCCESS;
	shortcuts: ShortcutProps[];
};

export type ActionProps =
	| undefined
	| {
			type: typeof ACTION_SET_STATUS;
			payload: {
				status:
					| typeof ACTION_STATUS_STALE
					| typeof ACTION_STATUS_ERROR
					| typeof ACTION_STATUS_SUCCESS;
			};
	  }
	| {
			type: typeof ACTION_GET_DATA;
			payload: {
				status:
					| string
					| typeof ACTION_STATUS_ERROR
					| typeof ACTION_STATUS_SUCCESS;
				shortcuts: ShortcutProps[];
			};
	  }
	| {
			type: typeof ACTION_SET_DATA;
			payload: {
				status: typeof ACTION_STATUS_STALE;
				shortcut: ShortcutProps;
			};
	  };

export type AppContextProps = {
	state?: StateProps;
	dispatch: React.Dispatch<ActionProps>;
};
