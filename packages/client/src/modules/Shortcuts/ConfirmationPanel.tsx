import { Button } from "@versini/ui-components";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { Suspense } from "react";

import LazyPanel from "../Lazy/Panel";
import { onClickDeleteShortcut } from "./handlers";

export const ConfirmationPanel = ({
	basicAuth,
	dispatch,
	showConfirmation,
	setShowConfirmation,
	section,
	position,
}: {
	basicAuth: string | boolean;
	dispatch: any;
	position: number | null;
	section: any;
	setShowConfirmation: any;
	showConfirmation: boolean;
}) => {
	return (
		<Suspense fallback={<div />}>
			<LazyPanel
				kind="messagebox"
				open={showConfirmation}
				onOpenChange={setShowConfirmation}
				title="Delete Shortcut"
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
									onClickDeleteShortcut({
										basicAuth,
										dispatch,
										section,
										position,
									});
								}}
							>
								Delete
							</Button>
						</FlexgridItem>
					</Flexgrid>
				}
			>
				<p>Are you sure you want to delete the following shortcut:</p>
				<ol>
					<li>
						Label:{" "}
						<span className="text-lg">
							{section.shortcuts[position || 0]?.label}
						</span>
					</li>
					<li>
						Section: <span className="text-lg">{section?.title}</span>
					</li>
				</ol>
			</LazyPanel>
		</Suspense>
	);
};
