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
			target,
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

		const extraProps = {
			target,
			rel: target === "_blank" ? "noopener noreferrer" : undefined,
		};

		return (
			<>
				<a
					ref={ref}
					type={type}
					aria-label={ariaLabel}
					className={buttonClass}
					href={link}
					{...extraProps}
				>
					{children}
				</a>
			</>
		);
	},
);
