import Papa from "papaparse";

export function JsonToCsvDownload(data: any) {
  const csv = Papa.unparse(data, {
    delimiter: ",",
    quoteChar: '"',
    newline: "\r\n",
  });

  // Encode CSV to base64
  const encodedCsvData = btoa(csv);

  // Create download link
  const downloadLink = document.createElement("a");

  // Set download link attributes
  downloadLink.href = `data:text/csv;charset=utf-8;base64,${encodedCsvData}`;
  downloadLink.download = "data.csv";

  // Trigger download
  downloadLink.click();
}
