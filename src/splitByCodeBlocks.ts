type Block = {
  isCode: boolean;
  text: string;
  meta?: string;
};

// Return a list of code blocks found in the input text.
export function splitByCodeBlocks(text: string): Block[] {
  const items = (text.startsWith("```") ? `\n${text}` : text).split("\n```");
  const [firstPara, ...rest] = items;
  return textBlock(firstPara).concat(parseBlocks(rest));
}

// Parse array of text chunks into array of Blocks.
// Even items are code blocks, odd items are text paragraphs.
// Recursive.
function parseBlocks(chunks: string[]): Block[] {
  //console.log(";", chunks);
  if (chunks.length === 0) {
    return [];
  } else if (chunks.length === 1) {
    return codeBlock(chunks[0]);
  } else {
    const [code, text, ...rest] = chunks;
    return codeBlock(code).concat(textBlock(text)).concat(parseBlocks(rest));
  }
}

// Return code Block.
// Detect optional language name at start of the block
// and add new line at the end.
function codeBlock(text: string): Block[] {
  const pos = text.indexOf("\n");
  const meta = text.substring(0, pos);
  return [
    {
      isCode: true,
      text: text.substring(pos + 1) + "\n",
      meta: meta === "" ? undefined : meta,
    },
  ];
}

// Return text Block if text is not empty.
function textBlock(text: string): Block[] {
  return text === ""
    ? []
    : [
        {
          isCode: false,
          text: text.replace(/(\n*)$/, "").replace(/^(\n*)/, ""),
        },
      ];
}
