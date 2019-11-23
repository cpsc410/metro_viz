import { AnalysisFileList} from '../input/AnalysisOutput';
import { LayoutNode } from './LayoutNode'
// import { LayoutNode, NodeEdge } from './LayoutNode'

export default class LayoutEngine {

    // private readonly MAX_PACKAGES = 6;
    private readonly SIZE_X = 1000;
    private readonly SIZE_Y = 600;

    private readonly MIN_DISTANCE = 5;
    private readonly INFLUENCE_DISTANCE = 200;
    private readonly SNAP_DISTANCE = 6;

    private readonly MOVE_FACTOR_TOWARDS = 0.4;
    private readonly MOVE_FACTOR_AWAY = 0.1;

    public layoutNodes(fileList: AnalysisFileList): LayoutNode[] {
        let nodes: LayoutNode[] = [];

        fileList.forEach((file) => {
            nodes.push({
                name: file.name,
                contributors: file.contributors,
                edges: null,
                x: Math.random() * (this.SIZE_X * 0.5),
                y: Math.random() * (this.SIZE_Y *  0.5)
            })
        })

        for (let i = 0; i < 1000; i++) {
            // nodes.forEach((target) => {
            //     let nIndex = Math.floor(Math.random() * (nodes.length - 1));
            //     this.pushPull(nodes[nIndex], target)
            //     // nodes.forEach((node) => this.pushPull(node, target));
            // });
            let index2 = Math.floor(Math.random() * (nodes.length - 1));
            let index1 = Math.floor(Math.random() * (nodes.length - 1));
            this.pushPull(nodes[index1], nodes[index2])
        }

        nodes.forEach((node) => {
            false && this.trySnaptoNearest(node, nodes);
        })

        //Load all files as nodes
        // let packages = new Set(); 

        // for (let dirLevel = 1; packages.size < this.MAX_PACKAGES; dirLevel++) {
        //     packages.clear();

        //     fileList.array.forEach(f => {
        //         let levels = f.name.split("/");
        //         packages.add(levels[Math.max(0, levels.size - dirLevel)]);
        //     });
        // }

        // console.log(packages.values())
        // let packageOrigins = [];

        // for (let packageIndex = 0; packageIndex < packages.size; packageIndex++) {
        //     let x = Math.random() * this.SIZE_X;
        //     let y = Math.random() * this.SIZE_Y;
        //     packageOrigins.push([x, y])
        // }

        // fileList.forEach((f) => {
            
        // });
        this.attachEdges(nodes)
        this.printAsCsv(nodes);

        return nodes;
    }

    private printAsCsv(nodes: LayoutNode[]): void {
        nodes.forEach((n) => {
            let output = "";
            output += n.name + ", ";
            output += n.x + ", ";
            output += n.y + ", ";
            console.log(output);
        });
    }

    private pushPull(node: LayoutNode, compare: LayoutNode): void {
        let dist = this.euclidianDistance(node, compare);
        if (dist > this.MIN_DISTANCE) {
            let diffX = compare.x - node.x;
            let diffY = compare.y - node.y;
            if (node.contributors.some(r => compare.contributors.indexOf(r) >= 0)) {
                // Shares some contribs
                node.x += diffX * this.MOVE_FACTOR_TOWARDS;
                node.y += diffY * this.MOVE_FACTOR_TOWARDS;

                //Snap
                // TODO is this the right place? maybe we should do this at the end
            } else if (dist < this.INFLUENCE_DISTANCE) {
                node.x -= diffX * this.MOVE_FACTOR_AWAY;
                node.y -= diffY * this.MOVE_FACTOR_AWAY;
                console.log("move away x = " + String(diffX * this.MOVE_FACTOR_AWAY))
                console.log("move away y = " + String(diffY * this.MOVE_FACTOR_AWAY))
            }
            
            node.x = node.x > this.SIZE_X ? this.SIZE_X : node.x
            node.x = node.x < 0 ? 0 : node.x
            node.y = node.y > this.SIZE_Y ? this.SIZE_Y : node.y
            node.y = node.y < 0 ? 0 : node.y
        }
    }

    private euclidianDistance(from: LayoutNode, to: LayoutNode): number {
        return Math.sqrt(Math.pow(Math.abs(from.x - to.x), 2) + Math.pow(Math.abs(from.y - to.y), 2));
    }

    private trySnaptoNearest(node: LayoutNode, nodes: LayoutNode[]) {
        //Find closest node (probably not the fastest way of doin this)
        let minNode = this.findClosestNode(node, nodes)

        let diffX = node.x - minNode.x;
        let diffY = node.y - minNode.y;

        if (diffX < this.SNAP_DISTANCE) {
            node.x = minNode.x
        } else if (diffY < this.SNAP_DISTANCE) {
            node.y = minNode.y;
        }

    }

    private findClosestNode(node: LayoutNode, nodes: LayoutNode[]): LayoutNode {
        let minDist = Number.MAX_VALUE;
        let minNode;
        nodes.filter((n) => {
            node.contributors.some(r => n.contributors.indexOf(r) >= 0) &&
            node != n
        }).forEach((n)  => {
            let dist = this.euclidianDistance(node, n);
            if (dist < minDist) {
                dist = minDist;
                minNode = n;
            }
        })

        return minNode;
    }

    private attachEdges(nodes: LayoutNode[]) {
        let remainingNodes = [...nodes];
        while (remainingNodes.length > 1) {
            let node = remainingNodes.pop();
            let closest = this.findClosestNode(node, remainingNodes);
            node.contributors.forEach((contrib => {
                if (closest.contributors.some(r => r == contrib)) {
                    node.edges.push({
                        contributor: contrib,
                        target: closest
                    });
                }
            }));
        }
    }
}