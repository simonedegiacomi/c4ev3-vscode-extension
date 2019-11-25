import { ExtensionContext, commands } from 'vscode';
import { createProject } from './project/create';
import { buildProject } from './project/build';
import { runProject } from './project/run';
import { uploadProject } from './project/upload';

// this method is called when your extension is activated
export function activate(context: ExtensionContext) {

	context.subscriptions.push(commands.registerCommand('extension.createNewProject', createProject));
	context.subscriptions.push(commands.registerCommand('extension.buildUpload', buildAndUpload));
	context.subscriptions.push(commands.registerCommand('extension.buildUploadRun', buildUploadAndRun));

	// DONE: intellisense
	// POSTPONED: compile all c files (one executable per main)
	// TODO: command to create new project (hardcoded paths)
	// TODO: download c4ev3
	// TODO: download ev3duder
	// TODO: install ev3duder
	// TODO: download compiler
	// TODO: Allow to specify where compiler installed?
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function buildAndUpload () {
	await buildProject();
	await uploadProject();
}

async function buildUploadAndRun() {
	await buildAndUpload();
	await runProject();
}
