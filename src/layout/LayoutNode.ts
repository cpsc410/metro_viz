export interface LayoutNode {
    name: string;
    edges: NodeEdge[];
    x: number;
    y: number;
}

export interface NodeEdge {
    contributor: string;
    target: LayoutNode;
}