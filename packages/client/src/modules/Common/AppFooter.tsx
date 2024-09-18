import { Footer } from "@versini/ui-footer";
import { APP_NAME, APP_OWNER } from "../../common/strings";

export const AppFooter = () => {
	return (
		<Footer
			mode="light"
			row1={
				<div>
					{APP_NAME} v{import.meta.env.BUILDVERSION} -{" "}
					{import.meta.env.BUILDTIME}
				</div>
			}
			row2={
				<div>
					&copy; {new Date().getFullYear()} {APP_OWNER}
				</div>
			}
		/>
	);
};
