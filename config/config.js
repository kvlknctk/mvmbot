const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    API_KEY: Joi.string().required().description("Api key from algolab"),
    HOSTNAME: Joi.string().required().description("Hostname from algolab"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  apiKey: envVars.API_KEY,
  apiCode: envVars.API_KEY.split("-")[1],
  hostName: envVars.HOSTNAME,
};
