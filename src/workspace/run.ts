import { Configuration } from "../Configuration";
import { getProjectName, getWorkspaceRoot, exec } from "./utils";

export async function runProject(configuration: Configuration){
    const projectName = getProjectName();
    await run(`../prjs/${projectName}/${projectName}.rbf`, configuration);
}

async function run(file: string, configuration: Configuration) {
    await exec(configuration.getEv3duderPath(), getWorkspaceRoot(), [
        'run',
        file
    ]);
}
