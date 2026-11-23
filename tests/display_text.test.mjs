import assert from "node:assert/strict";
import test from "node:test";
import { renderErrorText, renderViewLabel } from "../sim/scripts/RD/display_text.mjs";

const ownerDocument = {
  createElement: (tag) => ({ tag }),
  createTextNode: (value) => ({ text: value }),
};
function target() {
  return {
    ownerDocument,
    children: [],
    replaceChildren(...nodes) { this.children = nodes; },
    append(...nodes) { this.children.push(...nodes); },
  };
}

test("view labels preserve literal text and supported preset line breaks", () => {
  const node = target();
  renderViewLabel(node, "u < v & w > z<br />above");
  assert.deepEqual(node.children, [{ text: "u < v & w > z" }, { tag: "br" }, { text: "above" }]);
});

test("diagnostics render as text and only recognized FAQ topics create links", () => {
  const node = target();
  renderErrorText(node, "u < v\nUse a different symbol.", "unknown");
  assert.deepEqual(node.children, [{ text: "u < v" }, { tag: "br" }, { text: "Use a different symbol." }]);
  renderErrorText(node, "Unknown symbol.", "undeclared");
  assert.deepEqual(node.children, [
    { text: "Unknown symbol." }, " Click ",
    { tag: "a", href: "/user-guide/FAQ#undeclared", target: "_blank", rel: "noopener noreferrer", textContent: "here" },
    " for more information.",
  ]);
});
