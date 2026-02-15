import fs from "fs";
import csv from "csv-parser";

const results: any[] = [];

fs.createReadStream("rwanda_agri_hub_inventory.csv")
    .pipe(csv())
    .on("data", (data) => {
        results.push(data);
    })
    .on("end", () => {
        console.log("Rows loaded:", results.length);
        console.log("First row:", results[0]);
    });



