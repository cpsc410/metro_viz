import InputSystem from './InputSystem';
import { AnalysisFileItem } from './AnalysisOutput';
import fs = require('fs');

/**
 * Just reads input from "input.json"
 * eventually our reader will probably interface with the analysis tool
 */
export default class BoringStaticJSONReader implements InputSystem{
  public fetchData(): AnalysisFileItem[] {
    return JSON.parse(fs.readFileSync("input.json").toString());
  }
}
