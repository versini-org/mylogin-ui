module.exports = {
	"*.{ts,js,tsx,jsx}": [
		"eslint --ext ts,tsx --report-unused-disable-directives --fix",
		"prettier --write",
	],
};
