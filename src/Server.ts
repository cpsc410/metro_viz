import { Request, Response } from 'express';
import express = require('express');
import InputSystem from './input/InputSystem';
import BoringStaticJSONReader from './input/BoringStaticJSONReader';

const app = express();
const port = process.env.PORT || 3000;

// do all the processing here

const input: InputSystem = new BoringStaticJSONReader();
console.log(input.fetchData());

app.get('/api/map', (_req: Request, res: Response) => {
  res.json({ "__": "this will eventually be the map data to be rendered" });
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
