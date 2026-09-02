import dotenv from "dotenv";

dotenv.config();
global.Promise = require("bluebird");

try {
	const SegfaultHandler = require("segfault-handler");
	SegfaultHandler.registerHandler("crash.log");
} catch (error) {
	console.warn("segfault-handler native binding unavailable; continuing without crash logging.");
}
