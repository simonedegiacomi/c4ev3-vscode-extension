import { window, workspace, commands, Uri } from 'vscode';
import { TextEncoder } from 'util';

export async function createProject() {
    const projectDirectory = await askProjectDirectory();
    if (!projectDirectory) {
        return;
    }

    workspace.fs.createDirectory(projectDirectory);
    await initializeProjectDirectory(projectDirectory);

    // TODO: Open workspace
    await commands.executeCommand('vscode.openFolder', projectDirectory);
}

async function askProjectDirectory(): Promise<Uri | undefined> {
    const projectName = await askProjectName();
    if (!projectName) {
        return undefined;
    }
    const parentDirectory = await askParentDifrectory();
    if (!parentDirectory) {
        return undefined;
    }
    return appendFileToUri(parentDirectory, projectName);
}

async function askProjectName(): Promise<string | undefined> {
    // TODO: Ask name
    return await window.showInputBox({
        prompt: 'Enter new project name (then Enter to confirm, or ESc to exit)',
        validateInput(name: string): string | undefined {
            if (name.length === 0) {
                return;
            }
            if (name.indexOf(' ') >= 0) {
                return 'cannot contain spaces';
            }
        }
    });
}

async function askParentDifrectory(): Promise<Uri | undefined> {
    // TODO: Ask where
    const pickedFolders = await window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false
    });
    if (!pickedFolders || pickedFolders.length !== 1) {
        console.log('create project cancelled');
        return;
    }
    return pickedFolders[0];
}

async function initializeProjectDirectory(workspace: Uri) {
    const vscodeDirectory = await createVSCodeSubDirectory(workspace);
    await createRecommendedExtensionsFile(vscodeDirectory);
    await createCCppExtensionConfigFile(vscodeDirectory);
    await createLaunchFile(vscodeDirectory);
    await createMainCFile(workspace);
}


async function createVSCodeSubDirectory(workspaceDirectory: Uri): Promise<Uri> {
    const vscodeDirectory = appendFileToUri(workspaceDirectory, '.vscode');
    await workspace.fs.createDirectory(vscodeDirectory); // TODO: Handle error
    return vscodeDirectory;
}

async function createRecommendedExtensionsFile(vscodeDirectory: Uri) {
    await writeJsonFile(
        appendFileToUri(vscodeDirectory, 'extensions.json'), {
        recommendations: [
            "ms-vscode.cpptools"
        ]
    });
}

async function createCCppExtensionConfigFile(vscodeDirectory: Uri) {
    await writeJsonFile(
        appendFileToUri(vscodeDirectory, 'c_cpp_properties.json'), {
        "configurations": [
            {
                "name": "Linux",
                "includePath": [
                    "${workspaceFolder}/**",
                    "/home/simone/Workspaces/EV3-API/include"
                ],
                "defines": [],
                "compilerPath": "/usr/bin/arm-linux-gnueabi-gcc",
                "cStandard": "c11",
                "cppStandard": "c++17",
                "intelliSenseMode": "clang-x64",
                "compilerArgs": [
                    "-I",
                    "/home/simone/Workspaces/EV3-API/include",
                    "-L",
                    "/home/simone/Workspaces/EV3-API",
                    "-l",
                    "ev3api"
                ]
            }
        ],
        "version": 4
    });
}

async function createLaunchFile(vscodeDirectory: Uri) {
    await writeJsonFile(appendFileToUri(vscodeDirectory, 'launch.json'), {});
}
async function createMainCFile(workspaceDirectory: Uri) {
    await workspace.fs.writeFile(appendFileToUri(workspaceDirectory, 'main.c'), stringToUint8Array(`
        #include<ev3.h>

        int main() {
            return 0;
        }
    `));
}


function appendFileToUri(uri: Uri, file: string) {
    return Uri.parse(`${uri.toString()}/${file}`);
}


async function writeJsonFile(file: Uri, json: any) {
    await workspace.fs.writeFile(file, jsonToUint8Array(json));
}

function jsonToUint8Array(json: any): Uint8Array {
    return stringToUint8Array(JSON.stringify(json));
}

function stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

/*
function buildProject () {
    vscode.window.withProgress({
        location: ProgressLocation.Notification,
        title: "I am long running!",
        cancellable: true
    }, async (progress:any, token:any) => {
        token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
        });

        progress.report({ increment: 0 });


        await vscode.workspace.saveAll();

        progress.report({ increment: 10 });

        const workspaceRoot = vscode.workspace.workspaceFolders!![0].uri.path;
        const compiler = new SourceCompiler();


        await compiler.compile(workspaceRoot);


        progress.report({ increment: 30 }); // 40%


        const rbfBuilder = new RbfBuilder();
        await rbfBuilder.build(workspaceRoot);
        console.log('rbf built');

        progress.report({ increment: 10 }); // 50%

        const ev3 = EV3DuderEV3.build();
        //await ev3.beep(workspaceRoot);
        await ev3.upload(workspaceRoot, 'a.out', '../prjs/BrkProg_SAVE/a.elf');
        progress.report({ increment: 25 }); // 50%
        await ev3.upload(workspaceRoot, 'a.rbf', '../prjs/BrkProg_SAVE/a.rbf');
        progress.report({ increment: 25 }); // 100%

        await ev3.run(workspaceRoot, '../prjs/BrkProg_SAVE/a.rbf');

        vscode.window.showInformationMessage('Done!', 'Ok', 'Run');

    });
}
*/