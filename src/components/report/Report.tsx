import { useEffect, useState } from "react";
import { getReportData, getDataSet } from "./reports";

const getHeartRate = (
  signalLength: number,
  sampleRate: number,
  totalPeaks: number
) => {
  const totalSeconds = signalLength / sampleRate;
  const totalMinutes = totalSeconds / 60;
  const heartRate = totalPeaks / totalMinutes;

  // heart rate in bpm (beats per minute)
  return heartRate;
};

const getDatasets = () => {
  return [...new Set(getReportData().map((row) => row.dataset_name))];
};

const getAlgorithms = () => {
  return [...new Set(getReportData().map((row) => row.algo))];
};

const getRows = (dataset: string) => {
  const realHeader = "real";
  const cache: { [sample_name: string]: { [algo_name: string]: number } } = {};
  for (let row of getDataSet(dataset)) {
    cache[row.sample_name] = cache[row.sample_name] || {};
    cache[row.sample_name][row.algo] = getHeartRate(
      row.signal_length,
      row.fs,
      row.total_peaks
    );
    cache[row.sample_name][realHeader] = getHeartRate(
      row.signal_length,
      row.fs,
      row.total_real
    );
  }
  return Object.values(cache);
};

const getColor = (realValue: number, value: number) => {
  const intReal = Math.round(realValue);
  const intValue = Math.round(value);
  const intDiff = Math.abs(intReal - intValue);
  const ratio = Math.abs(+value / +realValue - 1);
  if (ratio <= 0.02 || intDiff <= 2) {
    return "green";
  }
  if (ratio <= 0.05 || intDiff <= 5) {
    return "lightgreen";
  }
  if (ratio <= 0.1 || intDiff <= 10) {
    return "yellow";
  }
  if (ratio <= 0.2 || intDiff <= 20) {
    return "red";
  }
  return "darkred";
};

export const Report = () => {
  useEffect(() => {
    // init
    setFields(["real", ...getAlgorithms()]);
    const datasets = getDatasets();
    setDatasets(datasets);
    setSelectedDataset(datasets[0]);
  }, []);

  const [fields, setFields] = useState<string[]>([]);
  const [ecgData, setEcgData] = useState<{ [key: string]: number }[]>([]);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("");

  useEffect(() => {
    setEcgData(getRows(selectedDataset));
  }, [selectedDataset]);

  return (
    <>
      <table>
        <tr>
          <td width="20" height="20" style={{ backgroundColor: "green" }}></td>
          <td>
            Medical grade accuracy, error is equal or less than max(2%, 2beats)
          </td>
        </tr>
        <tr>
          <td
            width="20"
            height="20"
            style={{ backgroundColor: "lightgreen" }}
          ></td>
          <td>
            Close to medical grade accuracy, error is equal or less than max(5%,
            5beats)
          </td>
        </tr>
        <tr>
          <td width="20" height="20" style={{ backgroundColor: "yellow" }}></td>
          <td>
            Usable for fitness devices, error is equal or less than max(10%,
            10beats)
          </td>
        </tr>
        <tr>
          <td width="20" height="20" style={{ backgroundColor: "red" }}></td>
          <td>Poor accuracy, error is equal or less than max(20%, 20beats)</td>
        </tr>
        <tr>
          <td
            width="20"
            height="20"
            style={{ backgroundColor: "darkred" }}
          ></td>
          <td>Very bad accuracy, error greater than max(20%, 20beats)</td>
        </tr>
      </table>
      <div style={{ padding: "5px 10px" }}>
        Data sets:
        <select onChange={(event) => setSelectedDataset(event.target.value)}>
          {datasets.map((ds) => (
            <option key={ds}>{ds}</option>
          ))}
        </select>
      </div>
      <table width="100%" border={1}>
        <tr>
          <th>#</th>
          {fields.map((field) => (
            <th key={field}>{field.replaceAll("_", " ")}</th>
          ))}
        </tr>
        {ecgData.map((row: any, i) => {
          return (
            <tr key={i}>
              <td>{i}</td>
              {fields.map((field) => (
                <td
                  key={i + "_" + field}
                  style={{
                    backgroundColor: getColor(row["real"], row[field]),
                  }}
                >
                  {(row[field] || 0).toFixed(2)}
                </td>
              ))}
            </tr>
          );
        })}
      </table>
    </>
  );
};
