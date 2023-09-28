import {
	ACTION_GET_DATA,
	ACTION_SET_DATA,
	ACTION_SET_STATUS,
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
	status: "stale" | "error" | "success";
	shortcuts: ShortcutProps[];
};

export type ActionProps =
	| undefined
	| {
			type: typeof ACTION_SET_STATUS;
			payload: {
				status: "error" | "success" | "stale";
			};
	  }
	| {
			type: typeof ACTION_GET_DATA;
			payload: {
				status: "error" | "success";
				shortcuts: ShortcutProps[];
			};
	  }
	| {
			type: typeof ACTION_SET_DATA;
			payload: {
				status: "stale";
				shortcut: ShortcutProps;
			};
	  };

export type AppContextProps = {
	state?: StateProps;
	dispatch: React.Dispatch<ActionProps>;
};
