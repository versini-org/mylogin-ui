import { ACTION_DATA } from "./constants";

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
	shortcuts: ShortcutProps[];
};

export type ActionProps =
	| undefined
	| {
			type: typeof ACTION_DATA;
			payload: {
				shortcuts: ShortcutProps[];
			};
	  };

export type AppContextProps = {
	state?: StateProps;
	dispatch: React.Dispatch<ActionProps>;
};
