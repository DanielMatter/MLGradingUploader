import { promises as fs } from 'fs'
import { join } from 'path'

export type Group = {
    groupId: number,
    correctionFile: string,
    correctionFileName: string,
    points: number,
}

export async function findGroupSubmissions(folder: string) : Promise<Group[]> {
    const group = [] as Group[]
    const files = await fs.readdir(folder)

    for(const filePath of files) {
        if(!(await fs.lstat(join(folder, filePath))).isDirectory())
            continue

        const pdfs = await fs.readdir(join(folder, filePath))
        const groupId = parseInt(filePath.match(/Group.([0-9]+).*/)[1])
        const corrected = pdfs.filter(file => file.match(/^[0-9]_.*\.pdf/))

        corrected.map(file => [file, file.match(/^([0-9])_.*\.pdf/)] as [ string, RegExpMatchArray ])
            .forEach(([file, match]) => {
                group.push({
                    groupId: groupId,
                    correctionFile: join(folder, filePath, file),
                    correctionFileName: file,
                    points: parseInt(match[1])
                })
            })
    }

    return group
}

export async function markAsDone(group: Group) {
    const newName = group.correctionFile.replace(group.correctionFileName, '_' + group.correctionFileName)
    await fs.rename(group.correctionFile, newName)
}