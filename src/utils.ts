import { workspace } from 'vscode';
import { spawn } from 'child_process';

export async function exec(executable: string, cwd: string, args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
        const pwd = spawn(executable, args, { cwd });
        pwd.on('close', (code: any) => resolve(code));

        pwd.stdout.on('data', (data: any) => {
            console.log(`stdout: ${data}`);
        });

        pwd.stderr.on('data', (data: any) => {
            console.error(`stderr: ${data}`);
        });
    });
}

export function getWorkspaceRoot() {
    return workspace.workspaceFolders!![0].uri.path;
}