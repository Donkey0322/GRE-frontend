const dotEnv = require('dotenv');
const { resolve } = require('node:path');

const dotEnvFileMap = {
  development: ['development'],
  production: ['production'],
};
console.log('📥 Fetching API Schema in mode =', process.env.NODE_ENV);
const envFileList = dotEnvFileMap[process.env.NODE_ENV];
envFileList?.forEach((envFile) => dotEnv.config({ path: resolve(__dirname, `./.env.${envFile}`) }));
dotEnv.config();
