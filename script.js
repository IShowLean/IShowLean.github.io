import coefficientStudent from "./constants.js";

function handleFile(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);

    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const allValues = jsonData
      .map((row) => Object.values(row))
      .flat()
      .map((value) => parseFloat(value))
      .filter((value) => !isNaN(value));

    const average = calculateAverage(allValues);
    const standardDeviation = calculateDeviation(allValues, average);
    const confidenceInterval = calculateConfidenceInterval(allValues.length, standardDeviation);

    clearParagraphs()
    if (isNaN(validateFile(allValues))) {
      document.getElementById("warning").innerText = "The file contains an inappropriate number of elements or empty";
    } else {
      document.getElementById("resultAverage").innerText = `Average value: ${average}`;

      document.getElementById("resultStandardDeviation").innerText = `Standart Deviation: ${standardDeviation}`;

      document.getElementById("resultConfidenceInterval").innerText = `Confidence Interval: ${confidenceInterval}`;
    }
  };
  reader.readAsArrayBuffer(file);
}

function validateFile(data) {
  if (data.length < 50 || data.length > 100) {
    return NaN;
  }
  return true;
}

function clearParagraphs() {
  document.getElementById("warning").innerText = "";
  document.getElementById("resultAverage").innerText = "";
  document.getElementById("resultStandardDeviation").innerText = "";
  document.getElementById("resultConfidenceInterval").innerText = "";
}

function calculateAverage(values) {
  const sum = values.reduce((acc, val) => acc + val, 0);
  const average = sum / values.length;
  return parseFloat(average.toFixed(2));
}

function calculateDeviation(data, average) {
  let sumOfTimesSquare = 0;
  for (let i = 0; i < data.length; i++) {
    sumOfTimesSquare += Math.pow(data[i] - average, 2);
  }

  const N = data.length;

  const Deviation = Math.pow((1 / (N * (N - 1))) * sumOfTimesSquare, 0.5);
  return parseFloat(Deviation.toFixed(3));
}

function calculateConfidenceInterval(N, standardDeviation) {
  const confidenceInterval = coefficientStudent[N] * standardDeviation;
  return parseFloat(confidenceInterval.toFixed(2));
}

function readFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const fileName = file.name;

    if (fileName.endsWith(".xlsx")) {
      handleFile(file);
    } else {
      alert("Please select a file with the .xlsx extension");
    }
  } else {
    alert("Please select a file");
  }
}

window.handleFile = handleFile;
window.calculateAverage = calculateAverage;
window.calculateDeviation = calculateDeviation;
window.calculateConfidenceInterval = calculateConfidenceInterval;
window.readFile = readFile;
