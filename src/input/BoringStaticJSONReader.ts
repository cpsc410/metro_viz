import InputSystem from './InputSystem';
import { AnalysisFileItem } from './AnalysisOutput';
import fs = require('fs');

/**
 * Just reads input from "input.json"
 * eventually our reader will probably interface with the analysis tool
 */
export default class BoringStaticJSONReader implements InputSystem{
  public fetchData(): AnalysisFileItem[] {
    let json = JSON.parse(fs.readFileSync("input.json").toString());
    let output: AnalysisFileItem[] = [];
      json.forEach(element => {
        output.push({
          name: element.fileName,
          path: element.fileName,
          contributors: element.topContributors
        })
      });
      // output.push({
      //   name: element.fileName,
      //   path: element.fileName,
      //   contributors: json.contributors ? Array.from(json.contributors.keys()) : []
      // })

    output = output.filter(e => e.contributors != undefined)
    return output;
  }
}
