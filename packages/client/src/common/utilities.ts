export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const truncate = (str: string, length: number) => {
	return str.length > length ? str.substring(0, length) + "..." : str;
};

/* c8 ignore start */
export const serviceCall = async ({
	name,
	data,
	method = "POST",
}: {
	name: string;
	data: any;
	method?: string;
}) => {
	const response = await fetch(
		`${import.meta.env.VITE_SERVER_URL}/api/${name}`,
		{
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);
	return response;
};
/* c8 ignore stop */

/* c8 ignore start */
export const getViewportWidth = () => {
	return Math.max(
		document.documentElement.clientWidth || 0,
		window.innerWidth || 0,
	);
};
/* c8 ignore stop */
