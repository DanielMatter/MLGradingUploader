import readline = require("readline");

export function requirePropery<T>(object: string, explanation: string, transformer: (string : string) => T = ((x) => (x as unknown as T))) : Promise<T> {
    if(object !== null && object !== undefined)
        return Promise.resolve(transformer(object))
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((res) => {
        rl.question(`${explanation}\n`, (answer) => {
            res(transformer(answer))
            rl.close()
        })
    })
}