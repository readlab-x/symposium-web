/**
 * @template T
 * @param {(value: T) => Promise<void>} runTask
 */
export function createLatestTaskRunner(runTask) {
	/** @type {Promise<void> | null} */
	let activeRun = null;
	/** @type {T | null} */
	let pendingValue = null;

	async function flushQueue() {
		try {
			while (pendingValue !== null) {
				const nextValue = pendingValue;
				pendingValue = null;
				await runTask(nextValue);
			}
		} finally {
			activeRun = null;
		}
	}

	return {
		/**
		 * @param {T} value
		 */
		run(value) {
			pendingValue = value;

			if (!activeRun) {
				activeRun = flushQueue();
			}

			return activeRun;
		}
	};
}
