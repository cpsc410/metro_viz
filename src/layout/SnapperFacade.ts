// import transitMap = require('transit-map');
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
          if(!edgeMap[node.name + edge.target]){
            edgeMap[node.name + edge.target] = {source: node.name, target: edge.target.name, relation: "subway", metadata: {lines: []}};
          }
          edgeMap[node.name + edge.target].metadata.lines.push(edge.contributor);
        }
      }
      for(let edge of Object.values(edgeMap)){
        input.edges.push(edge);
      }
      console.log(edgeNodes);
      input.nodes = input.nodes.filter((node: any) => edgeNodes.has(node.label));

      //console.log(input.nodes);

      lineNames.forEach((name: string) => {
        input.lines.push({id: name, color: color.getNext()});
      });
      //console.log(util.inspect(input, { depth: 4 }));
      // let map = await transitMap(input);
      //console.log(util.inspect(map, { depth: 4 }));
      const svg = svgTransitMap(input, false);
      return virtualDomStringify(svg)
  }

}
