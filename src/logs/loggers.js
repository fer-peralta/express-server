import log4js from "log4js"

log4js.configure({
    appenders:{
        console:{type:"console"},
        errorSystem:{type:"file", filename:"./src/logs/errors.log"},
        debugConsole:{type:"logLevelFilter", appender:"console",level:"debug"},
        errorConsole:{type:"logLevelFilter", appender:"console",level:"error"},
        errorFile:{type:"logLevelFilter",appender:"errorSystem",level:"error"}
    },
    categories:{
        default:{appenders:["debugConsole","errorFile"],level:"all"},
        production:{appenders:["errorFile"],level:"error"}
    }
})

// * If it's blank it uses the default category
export const logger = log4js.getLogger()