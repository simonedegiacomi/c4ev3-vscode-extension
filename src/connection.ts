import { InvokableExecutable, ConsoleInvocationLogger } from "./InvokableExecutable";
const { spawn } = require('child_process');


export class EV3DuderEV3 implements EV3 {

    static build():EV3DuderEV3 {
        return new EV3DuderEV3(new ConsoleInvocationLogger());
    }

    constructor(private ev3duder: InvokableExecutable) { }

    beep(workspaceDirectory: string): Promise<any> {
        return new Promise((resolve, reject) => {
			const pwd = spawn('/home/simone/Workspaces/GSoC/ev3duder/ev3duder', [
				'info'
			], {
				cwd: workspaceDirectory
			});

			pwd.stdout.on('data', (data: any) => {
				console.log(`stdout: ${data}`);
			});

			pwd.stderr.on('data', (data: any) => {
				console.error(`stderr: ${data}`);
			});

			pwd.on('close', (code: any) => {
				console.log(`child process exited with code ${code}`);
				resolve();
			});
		});
	}
	
	upload(workspaceDirectory: string, localFile: string, remotePath: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const pwd = spawn('/home/simone/Workspaces/GSoC/ev3duder/ev3duder', [
				'up',
				localFile,
				remotePath
			], {
				cwd: workspaceDirectory
			});

			pwd.stdout.on('data', (data: any) => {
				console.log(`stdout: ${data}`);
			});

			pwd.stderr.on('data', (data: any) => {
				console.error(`stderr: ${data}`);
			});

			pwd.on('close', (code: any) => {
				console.log(`child process exited with code ${code}`);
				resolve();
			});
		});
	}

	run(workspaceDirectory: string, file: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const pwd = spawn('/home/simone/Workspaces/GSoC/ev3duder/ev3duder', [
				'run',
				file
			], {
				cwd: workspaceDirectory
			});

			pwd.stdout.on('data', (data: any) => {
				console.log(`stdout: ${data}`);
			});

			pwd.stderr.on('data', (data: any) => {
				console.error(`stderr: ${data}`);
			});

			pwd.on('close', (code: any) => {
				console.log(`child process exited with code ${code}`);
				resolve();
			});
		});
	}

}

export interface EV3 {
    beep(workspaceDirectory: string): Promise<any>;
}
