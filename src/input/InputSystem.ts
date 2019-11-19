import { AnalysisFileList } from './AnalysisOutput';

export default interface InputSystem{
    fetchData(): AnalysisFileList;
}
