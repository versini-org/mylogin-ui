import React from "react";

import type { ButtonLinkProps } from "./ButtonTypes";
import { getButtonClasses, TYPE_LINK } from "./utilities";

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	(
		{
			children,
			kind = "dark",
			fullWidth = false,
			className,
			slim = false,
			type = "link",
			raw = false,
			"aria-label": ariaLabel,
			link,
		},
		ref,
	) => {
		const buttonClass = getButtonClasses({
			type: TYPE_LINK,
			kind,
			fullWidth,
			disabled: false,
			raw,
			className,
			slim,
		});

		return (
			<>
				<a
					ref={ref}
					type={type}
					aria-label={ariaLabel}
					className={buttonClass}
					href={link}
				>
					{children}
				</a>
			</>
		);
	},
);
