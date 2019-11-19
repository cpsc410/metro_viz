import { Request, Response } from 'express';
import express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// do all the processing here

app.get('/api/map', (_req: Request, res: Response) => {
  res.json({ "__": "this will eventually be the map data to be rendered" });
});

// maybe more endpoints here if we need them???

// all the rendering stuff will go in "public" and run in the browser
app.use(express.static('public'));
app.listen(port, () => console.log(`go to  http://localhost:${port} to view the map!`));
