require('dotenv').config();

type SubConfiguration = {
    readonly PORT: number;
}

type Configuration = {
    [index: string]: SubConfiguration;
}

const BackendConfiguration: Configuration = {
    development: {
        PORT: 3000
    },
    staging: {
        PORT: 3000
    }
};

export default BackendConfiguration;
