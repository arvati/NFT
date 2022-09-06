import { entropyToMnemonic, isValidMnemonic } from "@ethersproject/hdnode";
import { randomBytes } from "@ethersproject/random";
import * as yaml from "yamljs";
import fs from 'fs';
import * as dotenv from 'dotenv';

type Deploy = {
    value?: string | number | null;
    args: Record<string, string | number>;
    networks: Record<string, string> | any;
};

type Contract = Record<string,Deploy[]>;

interface AppConfig {
    env: Record<string, any>;
    ledger: {
        path: number;
        connect: boolean;
    };
    log: number;
    testNetwork: string;
    contract: Contract;
};

function omit(key: string, obj: Record<string, any>) {
    const { [key]: omitted, ...rest } = obj;
    return rest;
};

function getEnvVariable(key: string, defaultValue: any): any {
	if (process.env[key]) {
		return process.env[key];
	}
	if (!defaultValue) {
		throw `${key} is not defined and no default value was provided`;
	}
	return defaultValue;
}

function omitEnv(config: AppConfig) {
    if (!config.env) config.env = {};
    //Force mnemonic
    if (!config.env["mnemonic"]) config.env["mnemonic"] = "";
    for (const variable in config.env) {
        if (config.env.hasOwnProperty(variable)) config.env[variable] = "";
    }
    return config;
};

function getConfig (): AppConfig {
    return yaml.load("config.yml");
}

export const appConfig: AppConfig = omitEnv(getConfig());

export function setConfig (config: AppConfig) {
    if (!config.env) config.env = {};
    for (const variable in config.env) {
        if (config.env.hasOwnProperty(variable)) {
            const env: string | undefined = (process.env[variable]) ? process.env[variable] : "";
            if (env && !config.env[variable]) {
                config.env[variable] = env;
            }
        }
    }
    fs.writeFile("config.yml", yaml.stringify(config), (err) => {if (err) console.log(err); });
}

function createMnemonic (): string {
    return entropyToMnemonic(randomBytes(32));
}

export function config () {
    dotenv.config();
    let config: AppConfig = getConfig()
    if (!config.env) config.env = {};
    //Force mnemonic
    if (!isValidMnemonic(config.env["mnemonic"])) {
        config.env["mnemonic"] = createMnemonic();
        setConfig(config)
    }
    for (const variable in config.env) {
        if (config.env.hasOwnProperty(variable)) {
            process.env[variable] = config.env[variable]
        }
    }
}

export const logger = (type: number, msg: any) => {
    if (type <= appConfig.log) console.log(msg);
}

export function contructorArgs(constructor: Record<string, any>): Array<any> {
    var args = [];
    for (const arg in constructor) {
        if (constructor.hasOwnProperty(arg)) args.push(constructor[arg]);
    }
    return args;
}