import React from "react";

import { ACTION_STATUS_SUCCESS } from "../../common/constants";
import type { AppContextProps } from "../../common/types";

export const AppContext = React.createContext<AppContextProps>({
	state: {
		status: ACTION_STATUS_SUCCESS,
		sections: [],
		editMode: false,
		editSections: false,
	},
	dispatch: () => {},
});
