import transitMap = require('transit-map');
import { LayoutNode } from './LayoutNode';
import svgTransitMap = require('svg-transit-map');
import virtualDomStringify = require('virtual-dom-stringify');
import ColorPicker from './ColorPicker';
//const util = require('util');


export default class SnapperFacade {
  public static async SNAP_NODES(nodes: LayoutNode[]): Promise<any>{
      let color: ColorPicker = new ColorPicker();
      let input: any = {"nodes": [], "lines": [], "edges": []};
      let lineNames: Set<string> = new Set();
      let edgeNodes: Set<string> = new Set();
      let edgeMap = {};

      for (let node of nodes){
        input.nodes.push({id: node.name, label: node.name, metadata: {x: node.x, y: node.y}});
        for (let edge of node.edges){
            edgeNodes.add(node.name);
            edgeNodes.add(edge.target.name);
            lineNames.add(edge.contributor);
            if (!edgeMap[node.name + edge.target.name]) {
              edgeMap[node.name + edge.target.name] = {
                source: node.name,
                target: edge.target.name,
                relation: "subway",
                metadata: { lines: [] }
              };
            }
            if (edgeMap[node.name + edge.target.name].metadata.lines.indexOf(edge.contributor) === -1) {
              edgeMap[node.name + edge.target.name].metadata.lines.push(edge.contributor);
            }
          }
      }
      for(let edge of Object.values(edgeMap)){
        input.edges.push(edge);
      }
      input.nodes = input.nodes.filter((node: any) => edgeNodes.has(node.label));


      lineNames.forEach((name: string) => {
        input.lines.push({id: name, color: color.getNext()});
      });
      let svg;
;      try {
        let map = await transitMap(input);
        svg = svgTransitMap(map, false);
      }
      catch (e) {
        console.error("SOLVER FAILURE: Your repo has no solution. Sorry :(");
        svg = svgTransitMap(input, false);
      }
      return virtualDomStringify(svg)
  }

}
