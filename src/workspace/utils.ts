import { TextEncoder } from 'util';
import { workspace, Uri } from 'vscode';
import { spawn } from 'child_process';

export function appendFileToUri(uri: Uri, file: string) {
    return Uri.parse(`${uri.toString()}/${file}`);
}

export function getPathFromUri(uri: Uri): string {
    return uri.fsPath;
}

export async function writeJsonFile(file: Uri, json: any) {
    await workspace.fs.writeFile(file, jsonToUint8Array(json));
}

export function jsonToUint8Array(json: any): Uint8Array {
    return stringToUint8Array(JSON.stringify(json, null, 4));
}

export function stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

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

        pwd.on('error', err => reject(err));
    });
}

export function isC4ev3Project() {
    return true;
}
export function getWorkspaceRoot() {
    return workspace.workspaceFolders!![0].uri.path;
}
export function getProjectName() {
    return workspace.name;
}

