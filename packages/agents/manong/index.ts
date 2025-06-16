import { writeFile } from 'fs/promises';
import { join } from 'path';

export function ping() { return "manong pong"; }

export default function manong() {
  return {
    async onFile(event: { path: string }) {
      if (!event.path.endsWith(".pbix")) return;
      const out = `verify_${event.path.split("/").pop()?.replace(/[^a-z0-9]/gi,"_")}.sh`;
      const script = `#!/usr/bin/env bash
set -e
FILE="${event.path}"
if [[ -f "$FILE" ]]; then
  echo "✅ File exists: $FILE"
  echo "ℹ️ Upload manually via Power BI Service → https://app.powerbi.com/"
else
  echo "❌ File not found: $FILE"; exit 1
fi`;
      await writeFile(join('scripts', out), script);
      return `generated scripts/${out}`;
    },
    ping() { return "manong pong"; }
  };
}
