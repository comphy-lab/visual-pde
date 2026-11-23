const faqLinks = new Map([
  ["undeclared", "/user-guide/FAQ#undeclared"],
  ["cyclic", "/user-guide/FAQ#cyclic"],
]);

// Create only known formatting nodes; never parse option or diagnostic text.
function setTextLines(element, text, separator) {
  const document = element.ownerDocument;
  const nodes = [];
  String(text ?? "").split(separator).forEach((line, index) => {
    if (index > 0) nodes.push(document.createElement("br"));
    nodes.push(document.createTextNode(line));
  });
  element.replaceChildren(...nodes);
}

export function renderViewLabel(element, text) {
  // Built-in presets use this exact spelling for multi-line names.
  setTextLines(element, text, /<br \/>/);
}

export function renderErrorText(element, text, faqTopic) {
  setTextLines(element, text, "\n");
  const href = faqLinks.get(faqTopic);
  if (!href) return;

  const document = element.ownerDocument;
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "here";
  element.append(" Click ", link, " for more information.");
}
