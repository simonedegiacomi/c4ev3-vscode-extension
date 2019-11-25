import { ExtensionContext, commands } from 'vscode';
import { createProject } from './project/create';
import { buildProject } from './project/build';
import { runProject } from './project/run';
import { uploadProject } from './project/upload';
import { verifyAndPrepareEnvironment } from './environment/prepare';

// this method is called when your extension is activated
export function activate(context: ExtensionContext) {
	registerCommandWithVerification('extension.createNewProject', createProject);
	registerCommandWithVerification('extension.buildUpload', buildAndUpload);
	registerCommandWithVerification('extension.buildUploadRun', buildUploadAndRun);
	registerCommand('extension.showEnvironment', async () => {
		// TODO: Show environemnt (compiler version, c4ev3 version, ...)
	});

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
		await verifyAndPrepareEnvironment();
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
