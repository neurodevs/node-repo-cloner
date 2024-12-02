import { execSync } from 'child_process'
import fs from 'fs'
import { chdir } from 'process'
import { assertOptions } from '@sprucelabs/schema'
import {
    RepoCloner,
    RepoClonerConstructor,
    RepoClonerOptions,
} from '../abstract.types'
import SpruceError from '../errors/SpruceError'

export default class GitRepoCloner implements RepoCloner {
    public static Class?: RepoClonerConstructor
    public static execSync = execSync

    private urls!: string[]
    private dirPath!: string

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(options: RepoClonerOptions) {
        const { urls, dirPath } = assertOptions(options, ['urls', 'dirPath'])
        this.urls = urls
        this.dirPath = dirPath

        this.throwIfDirPathDoesNotExist()
        this.changeDirectoryToDirPath()
        this.cloneReposFromUrls()
    }

    private throwIfDirPathDoesNotExist() {
        if (!fs.existsSync(this.dirPath)) {
            throw new SpruceError({
                code: 'DIR_PATH_DOES_NOT_EXIST',
                dirPath: this.dirPath,
            })
        }
    }

    private changeDirectoryToDirPath() {
        chdir(this.dirPath)
    }

    private cloneReposFromUrls() {
        this.urls.forEach((url) => {
            this.execSync(`git clone ${url}`)
        })
    }

    private get execSync() {
        return GitRepoCloner.execSync
    }
}
