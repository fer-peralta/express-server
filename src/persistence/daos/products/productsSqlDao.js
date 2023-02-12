import { Containersql } from "../../managers/ContainerSql.js";

class ProductSqlDao extends Containersql {
    constructor(options, tablename) {
        super(options, tablename)
    }
}

export { ProductSqlDao }