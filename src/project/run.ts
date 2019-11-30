import { exec, getWorkspaceRoot, getEv3duderPath, getProjectName } from "../utils";

export async function runProject(){
    const projectName = getProjectName();
    run(`../prjs/${projectName}/${projectName}.rbf`);
}

async function run(file: string) {
    await exec(getEv3duderPath(), getWorkspaceRoot(), [
        'run',
        file
    ]);
}
