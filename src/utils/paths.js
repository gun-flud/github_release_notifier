import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const utilsDir = path.dirname(__filename);

export const ROOT_DIR = path.join(utilsDir, '../../');
export const SRC_DIR = path.join(utilsDir, '../');
export const TEMPLATES_DIR = path.join(utilsDir, '../templates');