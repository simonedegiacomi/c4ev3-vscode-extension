import { exec, getWorkspaceRoot } from "../utils";


export async function uploadProject() {
    const projectRoot = getWorkspaceRoot();
    const projectName = 'a';
    await upload(`${projectRoot}/${projectName}.out`, `../prjs/${projectName}/${projectName}.elf`);
    await upload(`${projectRoot}/${projectName}.rbf`, `../prjs/${projectName}/${projectName}.rbf`);
}

async function upload(localFile: string, remoteFile: string) {
    await exec('/home/simone/Workspaces/GSoC/ev3duder/ev3duder', getWorkspaceRoot(), [
        'up',
        localFile,
        remoteFile
    ]);
}
