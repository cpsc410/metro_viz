import { AnalysisFileList} from '../input/AnalysisOutput';
import { LayoutNode, NodeEdge } from './LayoutNode'

export default class LayoutEngine {

    // private readonly MAX_PACKAGES = 6;
    private readonly SIZE_X = 1000;
    private readonly SIZE_Y = 600;

    private readonly MIN_DISTANCE = 10;
    private readonly SNAP_DISTANCE = 3;

    private readonly MOVE_FACTOR_TOWARDS = 0.4;
    private readonly MOVE_FACTOR_AWAY = 0.05;

    public layoutNodes(fileList: AnalysisFileList): LayoutNode[] {
        let nodes: LayoutNode[] = [];

        fileList.forEach((file) => {
            nodes.push({
                name: file.name,
                contributors: file.contributors,
                edges: null,
                x: Math.random() * this.SIZE_X,
                y: Math.random() * this.SIZE_Y
            })
        })

        nodes.forEach((node) => {
            let compare = nodes[Math.floor(Math.random() * nodes.length)];
            this.pushPull(node, compare);
        });







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



        return nodes;
    }

    private pushPull(node: LayoutNode, compare: LayoutNode): void {
        let dist = this.euclidianDistance(node, compare);
        if (dist > this.MIN_DISTANCE) {
            let diffX = node.x - compare.x;
            let diffY = node.y - compare.y;
            if (node.contributors.some(r => compare.contributors.indexOf(r) >= 0)) {
                // Shares some contribs
                node.x += diffX * this.MOVE_FACTOR_TOWARDS;
                node.y += diffY * this.MOVE_FACTOR_TOWARDS;

                //Snap
                // TODO is this the right place? maybe we should do this at the end
                if (diffY < this.SNAP_DISTANCE) {
                    node.x = compare.x
                } else if (diffY < this.SNAP_DISTANCE) {
                    node.y = compare.y;
                }
            } else {
                node.x -= diffX * this.MOVE_FACTOR_AWAY;
                node.y -= diffY * this.MOVE_FACTOR_AWAY;
            }
        }
    }

    private euclidianDistance(from: LayoutNode, to: LayoutNode): number {
        return Math.sqrt(Math.pow(Math.abs(from.x - to.x), 2) + Math.pow(Math.abs(from.y - to.y), 2));
    }
}