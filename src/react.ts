import type { RendererParams } from "./main.js";
import _InlineStyleParser from "inline-style-parser";
const InlineStyleParser =
  _InlineStyleParser as unknown as typeof _InlineStyleParser.default;

const kebabToCamel = (s: string) =>
  s.replace(/([-][a-z])/g, (group) => group.toUpperCase().replace("-", ""));

const camelToSnake = (s: string) =>
  s.replace(/([A-Z])/g, (group) => `-${group.toLowerCase()}`);

const cssToJsxStyle = (s: string) => {
  return kebabToCamel(s);
};

const toJsxAttrName = (s: string) => {
  if (s.startsWith("aria") && /[A-Z]/.test(s["aria".length] ?? "")) {
    return camelToSnake(s);
  }
  return s;
};

export type AsReactText = {
  type: "text";
  rendered: string;
};
export type AsReactRoot<T> = {
  type: "root";
  rendered: T[];
};
export type AsReactElement<T> = {
  type: "element";
  Tag: keyof JSX.IntrinsicElements;
  props: Record<string, string | string[]>;
  renderedChildren: T[];
};
export type AsReact<T> = AsReactText | AsReactRoot<T> | AsReactElement<T>;

export const toReactStyle = <T>({
  node,
  renderedChildren,
}: RendererParams<T>): AsReact<T> => {
  if (node.type === "text")
    return {
      type: "text",
      rendered: node.value,
    };
  if (node.type === "root")
    return {
      type: "root",
      rendered: renderedChildren,
    };
  const Tag = node.tagName as keyof JSX.IntrinsicElements;
  const props =
    node.properties == null
      ? null
      : Object.fromEntries(
          Object.entries(node.properties).map(([k, v]) => {
            if (k === "className" && Array.isArray(v)) {
              return [k, v.join(" ")];
            }
            if (k === "style" && typeof v === "string") {
              return [
                k,
                Object.fromEntries(
                  InlineStyleParser(v).flatMap((e) => {
                    if (e.type === "declaration") {
                      return [[cssToJsxStyle(e.property), e.value]];
                    }
                    return [];
                  }),
                ),
              ];
            }
            return [toJsxAttrName(k), v];
          }),
        );
  return {
    type: "element",
    Tag,
    props,
    renderedChildren,
  };
};
