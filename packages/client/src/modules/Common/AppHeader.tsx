import { Header } from "@versini/ui-components";
import { IconStarInCircle } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";

export const AppHeader = () => {
	return (
		<Header mode="dark">
			<h1 className="heading mb-0">
				<Flexgrid alignVertical="center">
					<FlexgridItem>
						<IconStarInCircle spacing={{ r: 2 }} />
					</FlexgridItem>
					<FlexgridItem>My Shortcuts</FlexgridItem>
				</Flexgrid>
			</h1>
		</Header>
	);
};
