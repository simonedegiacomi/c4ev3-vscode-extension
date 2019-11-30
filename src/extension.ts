import { ExtensionContext, commands, workspace, window, ConfigurationTarget, Uri } from 'vscode';
import { createProject } from './project/create';
import { buildProject } from './project/build';
import { runProject } from './project/run';
import { uploadProject } from './project/upload';

// this method is called when your extension is activated
export function activate(context: ExtensionContext) {

	// TODO: check if environment is ready
		// TODO: Check if we have the latest version of c4ev3
			// TODO: Download if not
		// TODO: Check if we have ev3duder
			// Download if not
	// TODO: When creating a project, copy c4ev3

	registerCommandWithVerification('extension.createNewProject', () => createProject(Uri.file(context.extensionPath)));
	registerCommandWithVerification('extension.buildUpload', buildAndUpload);
	registerCommandWithVerification('extension.buildUploadRun', buildUploadAndRun);

	function registerCommandWithVerification(name: string, handler: () => Promise<void>) {
		registerCommand(name, verifyEnvironmentAndThen(handler));
	}

	function registerCommand(name: string, handler: () => Promise<void>) {
		context.subscriptions.push(commands.registerCommand(name, handler));
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }


function verifyEnvironmentAndThen(callback: () => Promise<void>): () => Promise<void> {
	return async () => {
		// TODO: Verify environment
		await callback();
	};
}

async function buildAndUpload() {
	await buildProject();
	await uploadProject();
}

async function buildUploadAndRun() {
	await buildAndUpload();
	await runProject();
}


// TODO: release c4ev3 automatically
// include/
// lib/
//		uclibc/
//		glibc/