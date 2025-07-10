import { createHash } from "node:crypto";

export function hashText(content: string, algo = "md5") {
  const hashFunc = createHash(algo);
  hashFunc.update(content);
  return hashFunc.digest("hex");
}
