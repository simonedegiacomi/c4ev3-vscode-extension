import { exec, getWorkspaceRoot, getProjectName, getEv3duderPath } from "../utils";


export async function uploadProject() {
    const projectRoot = getWorkspaceRoot();
    const projectName = getProjectName();
    await upload(`${projectRoot}/${projectName}.out`, `../prjs/${projectName}/${projectName}.elf`);
    await upload(`${projectRoot}/${projectName}.rbf`, `../prjs/${projectName}/${projectName}.rbf`);
}

async function upload(localFile: string, remoteFile: string) {
    await exec(getEv3duderPath(), getWorkspaceRoot(), [
        'up',
        localFile,
        remoteFile
    ]);
}
