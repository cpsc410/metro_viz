import transitMap = require('transit-map');
import { LayoutNode } from './LayoutNode';
import svgTransitMap = require('svg-transit-map');
import virtualDomStringify = require('virtual-dom-stringify');


export default class SnapperFacade {
  public static async SNAP_NODES(nodes: LayoutNode[]): Promise<any>{
      let input: any = {"nodes": [], "lines": [], "edges": []};
      let lineNames: Set<string> = new Set();
      let edgeMap = {};
      for (let node of nodes){
        input.nodes.push({id: node.name, label: node.name, metadata: {x: node.x, y: node.y}});
        for (let edge of node.edges){
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
      lineNames.forEach((name: string) => {
        input.lines.push({id: name, color: "#0a3c85"});
      });
      let map = await transitMap(input);
      const svg = svgTransitMap(map, false);
      return virtualDomStringify(svg)
  }

}
