const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "games");

fs.readdir(directoryPath, (err, files) => {
  if (err) return console.error("Directory read failed:", err);

  files.filter(file => file.endsWith(".html")).forEach(file => {
    const filePath = path.join(directoryPath, file);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return console.error(`Read failed for ${file}:`, err);

      const updated = data.replace(/<link\s+rel=["']stylesheet["'][^>]*?>\s*/gi, "");

      fs.writeFile(filePath, updated, "utf8", err => {
        if (err) console.error(`Write failed for ${file}:`, err);
        else console.log(`✅ Cleaned stylesheet link in: ${file}`);
      });
    });
  });
});
