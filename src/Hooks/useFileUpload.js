import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { DateFormatter } from "../Utils/CommonFunction";

const useFileUpload = (expectedHeaders, tabLocation, statusName) => {
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      setLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rawData.length > 0) {
          const fileHeaders = rawData[0];
          const isValid = expectedHeaders.some((header) =>
            fileHeaders.some((col) => col === header)
          );

          if (!isValid) {
            alert("CSV does not have the required headers.");
            setLoading(false);
            return;
          }

          // If the data is larger than 100 rows, take the last 100 rows
          const dataToProcess =
            rawData.length > 100 ? rawData.slice(-100) : rawData.slice(1);

          // Process each row and map the data
          const jsonData = dataToProcess
            .slice(1) // Skip header row
            .map((row, rowIndex) => {
              console.log(row, "row");
              const mappedData = {};

              fileHeaders.forEach((header, index) => {
                const value = row[index]; // Extract cell value
                // Validate header and value
                if (header === undefined || header === null) {
                  console.warn(
                    `Missing header for column ${index} in row ${rowIndex}`
                  );
                  return;
                }
                if (typeof value !== "string" && typeof value !== "number") {
                  console.warn(
                    `Invalid value for header "${header}" in row ${rowIndex}:`,
                    value
                  );
                  return;
                }

                // Mapping logic
                switch (header) {
                  case "Pickup City":
                  case "Pick City/ST":
                    mappedData["pickup_location"] = value;
                    break;
                  case "Ready":
                  case "Status":
                    mappedData["status"] = value || "waiting";
                    if (header === "Status") {
                      // Map Ready column to delivery_date
                      mappedData["delivery_date"] =
                        DateFormatter(value) || null;
                    }
                    break;
                  case "Orig Loads":
                  case "Loads":
                    mappedData["orig_load"] = value || null;
                    break;
                  case "Additional Notes":
                  case "Notes":
                    mappedData["notes"] = value || "";
                    break;
                  case "PO#":
                    mappedData["po_num"] = value ? String(value).trim() : "";
                    break;
                  case "Supplier":
                    mappedData["supplier"] = value || "";
                    break;
                  case "PO Date":
                    mappedData["po_date"] = DateFormatter(value);
                    break;
                  case "Trader":
                    mappedData["trader"] = value || "";
                    break;
                  case "Commodity":
                    mappedData["commodity"] = value || "";
                    break;
                  case "Missed Pick/Del":
                    mappedData["cd"] = row[0] === "Cust Del" ? true : false;
                    break;
                  default:
                    break;
                }
              });

              // Static fields
              mappedData["location"] = tabLocation || "null";
              mappedData["po_date"] =
                mappedData["po_date"] || new Date().toISOString();
              mappedData["pickup_location"] =
                mappedData["pickup_location"] || "null";
              mappedData["notes"] = mappedData["notes"] || "";
              mappedData["status"] = statusName;
              mappedData["cd"] = row[0] === "Cust Del" ? true : false;
              mappedData["bl"] = mappedData["bl"] || false;
              mappedData["user_name"] = mappedData["user_name"] || null;
              mappedData["date_created"] = new Date().toISOString();
              mappedData["delivery_date"] = mappedData["delivery_date"] || null;

              // Skip row if the "po_num" field is empty
              if (!mappedData["po_num"]) {
                return null;
              }

              // Skip empty rows
              const isRowEmpty = Object.values(mappedData).every(
                (value) => value === "" || value === null || value === false
              );
              return isRowEmpty ? null : mappedData;
            })
            .filter((row) => row !== null);

          setSheetData(jsonData);
        } else {
          alert("Uploaded file is empty.");
        }

        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    },
    [expectedHeaders, tabLocation, statusName]
  );

  return { loading, sheetData, setSheetData, handleFileUpload };
};

export default useFileUpload;
