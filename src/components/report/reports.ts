import report1 from "../../data/bidmc-ppg-and-respiration.json";
import report2 from "../../data/mit-bih-arrhythmia.json";
import report3 from "../../data/mit-bih-noise-stress-test-e00.json";
import report4 from "../../data/mit-bih-noise-stress-test-e06.json";
import report5 from "../../data/mit-bih-noise-stress-test-e12.json";
import report6 from "../../data/mit-bih-noise-stress-test-e18.json";
import report7 from "../../data/mit-bih-noise-stress-test-e24.json";
import report8 from "../../data/mit-bih-noise-stress-test-e_6.json";

export const getReportData = () => {
  return [
    ...report1,
    ...report2,
    ...report3,
    ...report4,
    ...report5,
    ...report6,
    ...report7,
    ...report8,
  ];
};

export const getDataSet = (datasetName: string) => {
  return getReportData().filter((row) => row.dataset_name === datasetName);
};
