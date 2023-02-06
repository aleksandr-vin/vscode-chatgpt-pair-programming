export function wrapToExec(snippet: string, template: string): string {
  const t = snippet + (snippet.endsWith("\n") ? "" : "\n");
  return template.split("[SNIPPET]").join(t) + "\n";
}
