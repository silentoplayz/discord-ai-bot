/**
 * Log severity levels.
 */
export const LogLevel = Object.freeze({
	Info: "info",
	Debug: "debug",
	Error: "error"
});

/**
 * Simple logger that supports production/debug modes and named contexts.
 *
 * The returned instance is callable: `log(level, ...args)`.
 *
 * @param {boolean | { production: boolean, name: string }} productionOrData
 * @param {string} [name]
 * @returns {Function & { data: { production: boolean, name: string } }}
 */
export function Logger(productionOrData, name) {
	let production, loggerName;

	if (typeof productionOrData === "object" && productionOrData !== null) {
		production = productionOrData.production;
		loggerName = productionOrData.name;
	} else {
		production = !!productionOrData;
		loggerName = name ?? "Logger";
	}

	const data = Object.freeze({ production, name: loggerName });

	/**
	 * Log a message at the given severity level.
	 * Debug messages are suppressed in production mode.
	 */
	function log(level, ...args) {
		if (level === LogLevel.Debug && production) return;

		const timestamp = new Date().toISOString();
		const prefix = `[${timestamp}] [${loggerName}] [${level.toUpperCase()}]`;

		switch (level) {
			case LogLevel.Error:
				console.error(prefix, ...args);
				break;
			case LogLevel.Debug:
				console.debug(prefix, ...args);
				break;
			case LogLevel.Info:
			default:
				console.log(prefix, ...args);
				break;
		}
	}

	log.data = data;
	return log;
}
