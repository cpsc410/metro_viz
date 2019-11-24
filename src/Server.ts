import { Request, Response } from 'express';
import express = require('express');
import InputSystem from './input/InputSystem';
import BoringStaticJSONReader from './input/BoringStaticJSONReader';
// import SnapperFacade from './layout/SnapperFacade';
// import { LayoutNode } from './layout/LayoutNode';
import LayoutEngine from './layout/LayoutEngine';
import SnapperFacade from './layout/SnapperFacade';

const app = express();
const port = process.env.PORT || 3000;



const input: InputSystem = new BoringStaticJSONReader();
// console.log(input.fetchData());
const layout: LayoutEngine = new LayoutEngine();

// do all the processing here

// let sampleFileA: LayoutNode = {name: "A", x: 0, y: 0, edges: []};
// let sampleFileB: LayoutNode = {name: "B", x: 10, y: 0, edges: []};
// let sampleFileC: LayoutNode = {name: "C", x: 20, y: 10, edges: []};
// sampleFileA.edges.push({contributor: "noa", target: sampleFileB});
// sampleFileB.edges.push({contributor: "noa", target: sampleFileC});

let map = "";

let nodes = layout.layoutNodes(input.fetchData());
//console.log(nodes);

SnapperFacade.SNAP_NODES(nodes).then((r: any) => map = r).catch((err: any) => console.log(err));


app.get('/api/map', (_req: Request, res: Response) => {
  res.end(map);
});
app.get('/api/map/:fileName', (_req: Request, res: Response) => {
  res.json({ "__": "this will eventually be a way to get additional info about a specific file in the map??? potentially link to github or send content?" });
});
app.get('/api/legend', (_req: Request, res: Response) => {
  res.json({ "__": "this will eventually be a listing of contributors" });
});
app.get('/api/metadata', (_req: Request, res: Response) => {
  res.json({ "__": "this will eventually produce any metadata needed (map titles, creation date, other stuff...)" });
});

// maybe more endpoints here if we need them???

// all the rendering stuff will go in "public" and run in the browser
app.use(express.static('public'));
app.listen(port, () => console.log(`go to  http://localhost:${port} to view the map!`));
