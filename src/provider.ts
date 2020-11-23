export function provide<T>(creator: () => Promise<T>) : Provider<T> {
    return new Provider<T>(creator)
}

export class Provider<T> {
    object: T
    creator: () => Promise<T>

    constructor(creator: () => Promise<T>) {
        this.creator = creator
    }

    async retrieve() : Promise<T> {
        if(this.object == null) this.object = await this.creator()
        return this.object
    }
}