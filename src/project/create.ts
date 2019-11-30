import { window, workspace, commands, Uri } from 'vscode';
import { appendFileToUri, writeJsonFile, stringToUint8Array, getPathFromUri } from './utils';
import * as AdmZip from 'adm-zip';

export async function createProject(extensionDirectory: Uri) {
    const projectPath = await askProjectPath();
    if (!projectPath) {
        return;
    }
    await createProjectDirectory(projectPath, extensionDirectory);
    await openProjectDirectory(projectPath);
}

async function askProjectPath(): Promise<Uri | undefined> {
    const projectName = await askProjectName();
    if (!projectName) {
        return undefined;
    }
    const parentDirectory = await askParentDirectory();
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

async function askParentDirectory(): Promise<Uri | undefined> {
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

async function createProjectDirectory(projectPath: Uri, extensionDirectory: Uri) {
    await workspace.fs.createDirectory(projectPath);
    await createVSCodeDirectory(projectPath);
    await createLibsDirectory(projectPath, extensionDirectory);
    await createMainCFile(projectPath);
}

async function createVSCodeDirectory(workspace: Uri) {
    const vscodeDirectory = await createVSCodeSubDirectory(workspace);
    await createRecommendedExtensionsFile(vscodeDirectory);
    await createCCppExtensionConfigFile(vscodeDirectory);
    await createLaunchFile(vscodeDirectory);
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
                    "lib/c4ev3/include"
                ],
                "cStandard": "c11",
                "cppStandard": "c++17",
                "intelliSenseMode": "clang-x64"
            }
        ],
        "version": 4
    });
}

async function createLaunchFile(vscodeDirectory: Uri) {
    await writeJsonFile(appendFileToUri(vscodeDirectory, 'launch.json'), {});
}

async function createLibsDirectory(workspaceDirectory: Uri, extensionDirectory: Uri) {
    const libsDirectory = appendFileToUri(workspaceDirectory, 'libs');
    await workspace.fs.createDirectory(libsDirectory);
    await extractC4ev3IntoDirectory(libsDirectory, extensionDirectory);
}

function extractC4ev3IntoDirectory(destination: Uri, extensionDirectory: Uri): Promise<any> {
    return new Promise((resolve, reject) => {
        const archivePath = appendFileToUri(extensionDirectory, 'c4ev3.zip');
        const archive = new AdmZip(getPathFromUri(archivePath));
        archive.extractAllToAsync(getPathFromUri(destination), false, error => {
            // TODO: Handle error
            resolve();
        });
    });
}

async function createMainCFile(workspaceDirectory: Uri) {
    await workspace.fs.writeFile(appendFileToUri(workspaceDirectory, 'main.c'), stringToUint8Array(
        "#include <ev3.h>\n\n" +
        "int main() {\n" +
        "   return 0;\n" +
        "}"
    ));
}

async function openProjectDirectory(projectPath: Uri) {
    await commands.executeCommand('vscode.openFolder', projectPath);
}
