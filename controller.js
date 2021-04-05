const fs = require("fs");
const baseUrl = "http://localhost:3000/files/";

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/uploads/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    if (!files || !files.length)
      return res.status(400).send({ message: "No files found" });

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const generateExcel = (req, res) => {
  try {
    // Requiring module
    const reader = require("xlsx");
    const directoryPath = __basedir + "/uploads/";
    const fileName = "test.xlsx";
    const sheetName = "Inventories";
    const inventories = require("../inventory.json").data;

    fs.writeFileSync("./uploads/test.xlsx");

    // Reading our test file
    const wb = reader.readFile("./uploads/test.xlsx");
    const ws = reader.utils.json_to_sheet(inventories);

    reader.utils.book_append_sheet(wb, ws, sheetName);

    //Delete the default sheet "Sheet1"
    wb.SheetNames.shift();
    delete wb.Sheets.Sheet1;

    // Writing to our file
    reader.writeFile(wb, "./uploads/test.xlsx");

    //First pass in the path and then the file name
    res.download(directoryPath + fileName, fileName);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getListFiles,
  download,
  generateExcel,
};
