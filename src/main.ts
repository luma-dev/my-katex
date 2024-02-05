import { unified } from "unified";
import rehypeParse from "rehype-parse";
import katex from "katex";
import { visit } from "@luma-dev/unist-util-visit-fast";

const parseHtml = unified().use(rehypeParse, { fragment: true });

export type NodeText = {
  type: "text";
  value: string;
};
export type NodeElement = {
  type: "element";
  tagName: string;
  properties: Record<string, string | string[]>;
  children: (NodeText | NodeElement)[];
};
export type NodeRoot = {
  type: "root";
  children: (NodeText | NodeElement)[];
};
export type Node = NodeText | NodeElement | NodeRoot;

export type RendererParams<T> = {
  renderedChildren: T[];
  node: Node;
};
type Renderer<T> = (params: RendererParams<T>) => T;
export type KatexOptions = katex.KatexOptions;
export const renderKatex = <T>(
  input: string,
  renderer: Renderer<T>,
  options?: KatexOptions,
): T => {
  const r = katex.renderToString(input, options);
  const p = parseHtml.parse(r);
  visit(p, (node) => {
    if (node.type === "element") {
      const ch0 = node.children[0];
      const ch1 = node.children[1];
      if (ch0?.type === "element" && ch1?.type === "element") {
        const className0 = ch0.properties.className;
        const className1 = ch1.properties.className;
        if (
          Array.isArray(className0) &&
          Array.isArray(className1) &&
          className0[0] === "vlist-r" &&
          className1[0] === "vlist-r"
        ) {
          node.children.pop();
        }
      }
    }
  });
  const dfs = (node: any): T => {
    return renderer({
      renderedChildren: node.children?.map(dfs) ?? [],
      node,
    });
  };
  return dfs(p);
};
