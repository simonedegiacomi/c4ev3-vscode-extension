import { workspace, ExtensionContext, Uri } from 'vscode';

export class Configuration {

    public readonly extensionPath: Uri;

    constructor(context: ExtensionContext) {
        this.extensionPath = Uri.file(context.extensionPath);
    }

    public getCompilerPathPrefix(): string {
        return this.getConfigurtionValue("compilerPathPrefix");
    }

    public getEv3duderPath(): string {
        return this.getConfigurtionValue("ev3duderPath");
    }

    public getCStandardLibrary(): string {
        return "glibc";
    }

    private getConfigurtionValue(key: string): string {
        const value = workspace.getConfiguration('c4ev3',).get<string>(key);
        if (!value) {
            throw new Error('no value in configuration and no default defined');
        }
        return value;
    }
}
