import log4js from "log4js"

log4js.configure({
    appenders: {
        console: { type: "console" },
        errorFile: { type: "file", filename: "./src/logs/error.log" },
        warnFile: { type: "file", filename: "./src/logs/warn.log" },

        //* Logger levels
        consoleLogger: { type: 'logLevelFilter', appender: 'console', level: 'info' },
        errorLogger: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' },
        warnLogger: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn' }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        error: { appenders: ['errorFile', 'console'], level: 'error' },
        warn: { appenders: ['warnFile', 'console'], level: 'warn' },
    }
})

const loggerInfo = log4js.getLogger()
const loggerError = log4js.getLogger('error')
const loggerWarn = log4js.getLogger('warn')

export { loggerInfo, loggerError, loggerWarn }