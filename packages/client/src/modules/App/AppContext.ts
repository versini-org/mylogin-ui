import React from "react";

import type { AppContextProps } from "../../common/types";

export const AppContext = React.createContext<AppContextProps>({
	state: { shortcuts: [] },
	dispatch: () => {},
});
