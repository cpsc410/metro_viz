import graphviz = require('graphviz');
import { LayoutNode } from './LayoutNode';
import ColorPicker from './ColorPicker';
import * as fs from 'fs';

export default class GraphViz{
  public static VIZ_GRAPH(nodes: LayoutNode[]): Promise<LayoutNode[]> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve => {
      console.log("GRAPHVIZ: Hi im running graphviz...");
      let g = graphviz.digraph("G");
      g.set("splines", "ortho");
      let color = new ColorPicker();
      let contribMap = {};
      for (let node of nodes){
        let n = g.addNode(node.name);
        n.set("fixedsize", "true");
        n.set("width", ".2");
      }
      for (let node of nodes){
        for (let edge of node.edges){
          if(!contribMap[edge.contributor]) contribMap[edge.contributor] = color.getNext();
          let e = g.addEdge(edge.source.name, edge.target.name);
          e.set("color", contribMap[edge.contributor]);
          e.set("penwidth", "1.5");
        }
      }
      g.output( "png", "gvout.png");
      g.output( "json", "gvout.json");
      setTimeout(() => { // This is a big hack :-(
        let input = JSON.parse(fs.readFileSync("gvout.json").toString());
        let objects = input.objects;
        for (let object of objects){
          for (let node of nodes){
            if(object.name === node.name){
              object.contributors = node.contributors;
              const coord = object.pos.split(',');
              node.x = coord[1];
              node.y = coord[0];
            }
          }
        }
        fs.writeFileSync("gvout.json", JSON.stringify(input));
        resolve(nodes);
      }, 3000);
    }));
  }
}
