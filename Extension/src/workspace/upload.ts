import { Configuration } from "../Configuration";
import { getWorkspaceRoot, getProjectName, exec } from "./utils";


export async function uploadProject(configuration: Configuration) {
    const projectRoot = getWorkspaceRoot();
    const projectName = getProjectName();
    await upload(`${projectRoot}/${projectName}.elf`, `../prjs/${projectName}/${projectName}.elf`, configuration);
    await upload(`${projectRoot}/${projectName}.rbf`, `../prjs/${projectName}/${projectName}.rbf`, configuration);
}

async function upload(localFile: string, remoteFile: string, configuration:Configuration) {
    await exec(configuration.getEv3duderPath(), getWorkspaceRoot(), [
        'up',
        localFile,
        remoteFile
    ]);
}
