export enum ClogColor {
    red = '\u001b[31m',
    blue = '\u001b[34m',
    yellow = '\u001b[33m',
}

const RESET = '\u001b[0m'

export default (text: string, color: ClogColor, reset = true) =>
    console.log(`${color} ${text} ${reset ? RESET : ''}`)