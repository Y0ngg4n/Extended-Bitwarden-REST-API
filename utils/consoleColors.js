const black = "\u001b[30m"
const red = "\u001b[31m"
const green = "\u001b[32m"
const yellow = "\u001b[33m"
const blue = "\u001b[34m"
const magenta = "\u001b[35m"
const cyan =  "\u001b[36m"
const white = "\u001b[37m"
const reset =  "\u001b[0m"

const errorPrefix = red + "[Error] "
const warningPrefix = yellow + "[Warn] "
const debugPrefix = magenta+ "[Debug] "
const infoPrefix = cyan + "[Info] "

module.exports = {
    errorPrefix,
    warningPrefix,
    debugPrefix,
    infoPrefix,
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    reset
}