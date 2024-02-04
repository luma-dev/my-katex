import { unified } from "unified";
import rehypeParse from "rehype-parse";
import katex from "katex";

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
  const dfs = (node: any): T => {
    return renderer({
      renderedChildren: node.children?.map(dfs) ?? [],
      node,
    });
  };
  return dfs(p);
};
