import assert from "node:assert/strict";

import { createLatestTaskRunner } from "../src/lib/components/relations/g6-render-queue.js";

const calls = [];
let releaseFirstTask = null;

const firstTaskReady = new Promise((resolve) => {
	releaseFirstTask = resolve;
});

let waitForFirstRelease = null;
const firstTaskReleased = new Promise((resolve) => {
	waitForFirstRelease = resolve;
});

const runner = createLatestTaskRunner(async ({ value }) => {
	calls.push(`start:${value}`);

	if (value === 1) {
		releaseFirstTask();
		await firstTaskReleased;
	}

	calls.push(`end:${value}`);
});

const firstRun = runner.run({ value: 1 });
await firstTaskReady;
const secondRun = runner.run({ value: 2 });
const thirdRun = runner.run({ value: 3 });
waitForFirstRelease();
await Promise.all([firstRun, secondRun, thirdRun]);

assert.deepEqual(calls, ["start:1", "end:1", "start:3", "end:3"]);

const recoveryCalls = [];
const recoveryRunner = createLatestTaskRunner(async ({ value }) => {
	recoveryCalls.push(value);

	if (value === "fail") {
		throw new Error("expected failure");
	}
});

await assert.rejects(recoveryRunner.run({ value: "fail" }), /expected failure/);
await recoveryRunner.run({ value: "ok" });

assert.deepEqual(recoveryCalls, ["fail", "ok"]);

console.log("g6-render-queue test passed");
