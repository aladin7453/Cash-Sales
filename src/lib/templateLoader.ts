import { readFile } from "fs/promises";
import path from "path";

export async function loadTemplate(customer: string, template: string) {
  const base = process.env.TEMPLATE_BASE_PATH!;
  const filePath = path.join(base, customer, `${template}.html`);
  return readFile(filePath, "utf-8");
}
