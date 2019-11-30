import { ExtensionContext, commands, workspace, window, ConfigurationTarget, Uri } from 'vscode';
import { createProject } from './workspace/create';
import { buildProject } from './workspace/build';
import { runProject } from './workspace/run';
import { uploadProject } from './workspace/upload';
import { Configuration } from './Configuration';

export function activate(context: ExtensionContext) {
	const configuration = new Configuration(context);

	registerCommandWithVerification('extension.createNewProject', () => createProject(configuration));
	registerCommandWithVerification('extension.buildUpload', () => buildAndUpload(configuration));
	registerCommandWithVerification('extension.buildUploadRun', () => buildUploadAndRun(configuration));

	function registerCommandWithVerification(name: string, handler: () => Promise<void>) {
		registerCommand(name, verifyEnvironmentAndThen(handler));
	}

	function registerCommand(name: string, handler: () => Promise<void>) {
		context.subscriptions.push(commands.registerCommand(name, handler));
	}
}

export function deactivate() { }

function verifyEnvironmentAndThen(callback: () => Promise<void>): () => Promise<void> {
	return async () => {
		// TODO: Verify environment
		await callback();
	};
}

async function buildAndUpload(configuration: Configuration) {
	await workspace.saveAll();
	await buildProject(configuration);
	await uploadProject(configuration);
}

async function buildUploadAndRun(configuration: Configuration) {
	await buildAndUpload(configuration);
	await runProject(configuration);
}
