import { workspace } from 'vscode';
import { getWorkspaceRoot, exec } from '../utils';

export async function buildProject() {
    await workspace.saveAll(); // TODO: Move somewhere else
    await compile();
    await buildRbf();
}

async function compile() {
    await exec('arm-linux-gnueabi-gcc', getWorkspaceRoot(),[
        'main.c',
        '-I', '/home/simone/Workspaces/GSoC/EV3-API/include',
        '-L', '/home/simone/Workspaces/GSoC/EV3-API',
        '-l', 'ev3api'
    ]);
}

async function buildRbf() {
    await exec('/home/simone/Workspaces/GSoC/ev3duder/ev3duder', getWorkspaceRoot(), [
        'mkrbf',
        '../prjs/a/a.elf', 'a.rbf'
    ]);
}

