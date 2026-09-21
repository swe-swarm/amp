#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(root, "schemas", "amp.manifest.schema.json");
const examplesDir = join(root, "examples");
const invalidDir = join(root, "tests", "invalid");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  validateSchema: true
});
addFormats(ajv);

const validate = ajv.compile(schema);

function listJson(dir) {
  try {
    return readdirSync(dir)
      .filter((name) => name.endsWith(".json"))
      .sort();
  } catch {
    return [];
  }
}

const examples = listJson(examplesDir);
const invalids = listJson(invalidDir);

if (examples.length === 0) {
  console.error("No example manifests found.");
  process.exit(1);
}

let failed = 0;
for (const name of examples) {
  const manifest = JSON.parse(readFileSync(join(examplesDir, name), "utf8"));
  const ok = validate(manifest);
  if (ok) {
    console.log(`ok   ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL ${name} (expected valid)`);
    console.error(JSON.stringify(validate.errors, null, 2));
  }
}

for (const name of invalids) {
  const manifest = JSON.parse(readFileSync(join(invalidDir, name), "utf8"));
  const ok = validate(manifest);
  if (!ok) {
    console.log(`rej  ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL ${name} (expected invalid)`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} fixture(s) failed.`);
  process.exit(1);
}

console.log(
  `\nValidated ${examples.length} example(s) and rejected ${invalids.length} invalid fixture(s) against ${schema.$id}`
);
