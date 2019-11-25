import { exec, getWorkspaceRoot } from "../utils";

export async function runProject(){
    run('../prjs/a/a.rbf');
}

async function run(file: string) {
    await exec('/home/simone/Workspaces/GSoC/ev3duder/ev3duder', getWorkspaceRoot(), [
        'run',
        file
    ]);
}
