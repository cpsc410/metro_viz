export interface LayoutNode {
    name: string;
    contributors: string[];
    edges: NodeEdge[];
    x: number;
    y: number;
}

export interface NodeEdge {
    contributor: string;
    target: LayoutNode;
    source: LayoutNode;
}