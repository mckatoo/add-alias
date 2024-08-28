import { homedir } from "os";


export const ZSHRC_PATH = `${homedir}/.zshrc`
export const ALIASES_PATH = `${homedir}/.aliases`

export const DATE = new Date()
export const DAY = DATE.getDate()
export const MONTH = DATE.getMonth()
export const YEAR = DATE.getFullYear()
export const HOUR = DATE.getHours()
export const MINUTE = DATE.getMinutes()
export const SECONDS = DATE.getSeconds()
export const NOW = `${DAY}-${MONTH}-${YEAR}_${HOUR}-${MINUTE}-${SECONDS}`

export const BKP_DIR = `${homedir}/bkp-zshrc`
