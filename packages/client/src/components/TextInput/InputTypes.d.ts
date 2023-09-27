export type TextInputProps = {
	errorMessage?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	className?: string;
	type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
} & React.InputHTMLAttributes<HTMLInputElement>;
