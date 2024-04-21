import { Button } from "@versini/ui-components";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { Suspense, lazy } from "react";

const LazyPanel = lazy(() => import("../Lazy/LazyPanel"));

export const ConfirmationPanel = ({
	showConfirmation,
	setShowConfirmation,
	action,
	children,
}: {
	action: () => void;
	children: React.ReactNode;
	setShowConfirmation: (show: boolean) => void;
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
									setShowConfirmation(false);
									action();
								}}
							>
								Delete
							</Button>
						</FlexgridItem>
					</Flexgrid>
				}
			>
				{children}
			</LazyPanel>
		</Suspense>
	);
};
