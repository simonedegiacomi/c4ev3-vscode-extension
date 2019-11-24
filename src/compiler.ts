
const { spawn } = require('child_process');

class SourceCompiler {
	compile(workspaceDirectory: string): Promise<any> {

		return new Promise((resolve, reject) => {
			const pwd = spawn('arm-linux-gnueabi-gcc', [
				'main.c',
				'-I', '/home/simone/Workspaces/EV3-API/include',
				'-L', '/home/simone/Workspaces/EV3-API',
				'-l', 'ev3api'
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

class RbfBuilder {
	build(workspaceDirectory: string): Promise<any> {

		return new Promise((resolve, reject) => {
			const pwd = spawn('/home/simone/Workspaces/ev3duder/ev3duder', [
				'mkrbf',
				'../prjs/BrkProg_SAVE/a.elf', 'a.rbf'
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