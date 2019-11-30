import { TextEncoder } from 'util';
import { workspace, Uri } from 'vscode';

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
