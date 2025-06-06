import fs from "node:fs";
import * as core from "@actions/core";
import * as toml from "smol-toml";

export function getUvVersionFromConfigFile(
  filePath: string
): string | undefined {
  core.info(`Trying to find required-version for uv in: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    core.info(`Could not find file: ${filePath}`);
    return undefined;
  }
  let requiredVersion: string | undefined;
  try {
    requiredVersion = getRequiredVersion(filePath);
  } catch (err) {
    const message = (err as Error).message;
    core.warning(`Error while parsing ${filePath}: ${message}`);
    return undefined;
  }

  if (requiredVersion?.startsWith("==")) {
    requiredVersion = requiredVersion.slice(2);
  }
  if (requiredVersion !== undefined) {
    core.info(
      `Found required-version for uv in ${filePath}: ${requiredVersion}`
    );
  }
  return requiredVersion;
}

function getRequiredVersion(filePath: string): string | undefined {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  if (filePath.endsWith("pyproject.toml")) {
    const tomlContent = toml.parse(fileContent) as {
      tool?: { uv?: { "required-version"?: string } };
    };
    return tomlContent?.tool?.uv?.["required-version"];
  }
  const tomlContent = toml.parse(fileContent) as {
    "required-version"?: string;
  };
  return tomlContent["required-version"];
}

export function getPythonVersionFromConfigFile(
  filePath: string
): string | undefined {
  core.info(`Trying to find requires-python in: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    core.info(`Could not find file: ${filePath}`);
    return undefined;
  }
  let pythonVersion: string | undefined;
  try {
    pythonVersion = getPythonVersion(filePath);
  } catch (err) {
    const message = (err as Error).message;
    core.warning(`Error while parsing ${filePath}: ${message}`);
    return undefined;
  }

  if (pythonVersion !== undefined) {
    core.info(`Found requires-python in ${filePath}: ${pythonVersion}`);
  }
  return pythonVersion;
}

function getPythonVersion(filePath: string): string | undefined {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  if (filePath.endsWith("pyproject.toml")) {
    const tomlContent = toml.parse(fileContent) as {
      project?: { "python-version"?: string };
    };
    return tomlContent?.project?.["python-version"];
  }
  const tomlContent = toml.parse(fileContent) as {
    "requires-python"?: string;
  };
  return tomlContent["requires-python"];
}
