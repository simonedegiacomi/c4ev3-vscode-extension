import { ExtensionContext, commands } from 'vscode';
import { createProject } from './project';

// this method is called when your extension is activated
export function activate(context: ExtensionContext) {



	async function buildProject() {
		console.log('building project...');
	}
	async function runProject() {
		console.log('runnign project...');
	}

	context.subscriptions.push(commands.registerCommand('extension.createNewProject', createProject));
	context.subscriptions.push(commands.registerCommand('extension.buildDownload', buildProject));
	context.subscriptions.push(commands.registerCommand('extension.buildDownloadRun', async () => {
		await buildProject();
		await runProject();
	}));

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
