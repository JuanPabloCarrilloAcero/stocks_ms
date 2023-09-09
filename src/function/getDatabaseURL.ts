import * as process from "process";
import * as dotenv from "dotenv";

export function getDatabaseUrl(): string {
    dotenv.config();

    let url = process.env.DATABASE_URI;
    let username = process.env.DATABASE_USER;
    let password = process.env.DATABASE_PASSWORD;
    let database = process.env.DATABASE;
    return url.replace('<user>', username).replace('<password>', password).replace('<database>', database);
}