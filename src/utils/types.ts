import { Literal, Node as ESTreeNode } from "estree";

export type ConfigureSource = Literal;

export type Node = ESTreeNode & NodeParentExtension;
export interface NodeParentExtension {
  parent: Node;
}

export interface ConfigSettings {
  config?: string
}