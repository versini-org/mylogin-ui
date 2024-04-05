import { Button } from "@versini/ui-components";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { Suspense } from "react";

import { onClickDeleteSection } from "../../common/handlers";
import LazyPanel from "../Lazy/Panel";

export const ConfirmationPanel = ({
	showConfirmation,
	setShowConfirmation,
	sectionToDeleteRef,
	dispatch,
	basicAuth,
}: {
	basicAuth: any;
	dispatch: any;
	sectionToDeleteRef: any;
	setShowConfirmation: (show: boolean) => void;
	showConfirmation: boolean;
}) => {
	return (
		<Suspense fallback={<div />}>
			<LazyPanel
				kind="messagebox"
				open={showConfirmation}
				onOpenChange={setShowConfirmation}
				title="Delete Section"
				footer={
					<Flexgrid columnGap={2} alignHorizontal="flex-end">
						<FlexgridItem>
							<Button
								mode="dark"
								variant="secondary"
								focusMode="light"
								onClick={() => {
									setShowConfirmation(false);
								}}
							>
								Cancel
							</Button>
						</FlexgridItem>
						<FlexgridItem>
							<Button
								mode="dark"
								variant="danger"
								focusMode="light"
								onClick={() => {
									setShowConfirmation(!showConfirmation);
									onClickDeleteSection({
										dispatch,
										basicAuth,
										section: sectionToDeleteRef.current,
									});
								}}
							>
								Delete
							</Button>
						</FlexgridItem>
					</Flexgrid>
				}
			>
				<p>
					Are you sure you want to delete section{" "}
					<span className="text-lg">{sectionToDeleteRef?.current?.title}</span>?
				</p>
			</LazyPanel>
		</Suspense>
	);
};
