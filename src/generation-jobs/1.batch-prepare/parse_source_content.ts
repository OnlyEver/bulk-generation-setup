export function parseData(
  content: any,
  titlesToRemove: any,
  blocTypesToRemove: any
) {
  let dataAfterRemovingUnWantedBlocks = removeSectionsByTitle(
    content,
    titlesToRemove,
    blocTypesToRemove
  );
  let afterSanitized = sanitizeBlocks(dataAfterRemovingUnWantedBlocks);
  return JSON.stringify({
    type: content.type,
    title: content.title,
    content: afterSanitized,
    headings: content.headings,
    taxonomy: content.taxonomy,
  });
}

export function removeSectionsByTitle(
  data: any,
  titlesToRemove: any,
  blockTypeToRemove: any
) {
  let dataAfterRemoving = [];
  for (let elem of data) {
    if (elem.block_type == "heading" && titlesToRemove.includes(elem.content)) {
      continue;
    }
    /// remove unwanted blcok types , for now `table` and `empty_line`
    if (blockTypeToRemove.includes(elem.block_type)) {
      continue;
    }
    if (elem.children) {
      elem.children = removeSectionsByTitle(elem.children, [], []);
    }
    dataAfterRemoving.push(elem);
  }
  return dataAfterRemoving;
}

export function sanitizeWikiContent(content: any) {
  // Remove newline characters
  content = content.replace(/\\n/g, " ");

  // Remove internal link references, keeping only the link text
  // Pattern explanation: [[link|text|index|wiki]] --> text
  content = content.replace(/\[\[.*?\|(.*?)\|.*?\|wiki\]\]/g, "$1");

  // Remove external links, keeping only the link text
  // Pattern explanation: [url text] --> text
  content = content.replace(/\[http[s]?:\/\/[^\s]+ ([^\]]+)\]/g, "$1");

  // Remove Markdown link references, keeping only the link text
  // Pattern explanation: ![link text](url) --> link text
  content = content.replace(/\!\[([^\]]+)\]\([^\)]+\)/g, "$1");

  return content;
}

export function sanitizeBlocks(blocks: Array<any>) {
  let sanitizedBlocks: any = [];
  blocks = blocks.filter((item) => item.block_type != "table");
  blocks.forEach((block: any) => {
    let sanitizedBlock: any = {};
    for (let key in block) {
      let value = block[key];
      if (typeof value === "string") {
        sanitizedBlock[key] = sanitizeWikiContent(value);
      } else if (Array.isArray(value)) {
        sanitizedBlock[key] = sanitizeBlocks(value);
      } else {
        sanitizedBlock[key] = value;
      }
    }
    sanitizedBlocks.push(sanitizedBlock);
  });
  return sanitizedBlocks;
}