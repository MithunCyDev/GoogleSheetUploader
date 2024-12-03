import { useState, useCallback } from "react";
import axios from "axios";
import { DateFormatter } from "../Utils/CommonFunction";

const usePostData = (apiUrl) => {
  const [isUploading, setIsUploading] = useState(false);
  const [successNumber, setSuccessNumber] = useState(0);
  const [failureNumber, setFailureNumber] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);

  const postData = useCallback(
    async (sheetData) => {
      if (!sheetData || sheetData.length === 0) {
        alert("No data to send. Please upload a sheet first.");
        return;
      }
      //   console.log(sheetData);

      let index = 0;
      let successCount = 0;
      let failureCount = 0;
      const errors = [];
      const successes = [];

      if (apiUrl) {
        try {
          setIsUploading(true);
          // Fetch existing data from API
          const { data: existingData } = await axios.get(apiUrl);

          const intervalId = setInterval(async () => {
            if (index >= sheetData.length) {
              clearInterval(intervalId);
              setIsUploading(false);

              // Final success/failure alert
              alert(
                `Upload complete!\nSuccess: ${successCount}\nFailed: ${failureCount}\n\nError Messages:\n${errors.join(
                  "\n"
                )}`
              );
              return;
            }

            const currentRow = sheetData[index];
            const parsedRow = {
              ...currentRow,
              po_date: DateFormatter(currentRow.po_date),
              orig_load: currentRow.orig_load
                ? parseInt(currentRow.orig_load, 10)
                : null,
            };

            const existingRecord = existingData?.find(
              (record) => record["po_num"] === currentRow["po_num"]
            );

            try {
              if (existingRecord) {
                // PUT request for existing record
                const putResponse = await axios.put(
                  `${apiUrl}${existingRecord.id}`,
                  parsedRow
                );
                console.log(
                  `Row ${index + 1} updated successfully:`,
                  putResponse.data
                );
                successCount++;
                successes.push(
                  `Row ${index + 1} updated successfully with ID: ${
                    existingRecord.id
                  }`
                );
                setSuccessNumber(successCount);
                setSuccessMessages((prev) => [
                  ...prev,
                  `Row ${index + 1} updated successfully`,
                ]);
              } else {
                // POST request for new record
                const postResponse = await axios.post(apiUrl, parsedRow);
                console.log(
                  `Row ${index + 1} uploaded successfully:`,
                  postResponse.data
                );
                successCount++;
                successes.push(`Row ${index + 1} uploaded successfully`);
                setSuccessNumber(successCount);
                setSuccessMessages((prev) => [
                  ...prev,
                  `Row ${index + 1} uploaded successfully`,
                ]);
              }
            } catch (error) {
              console.error(
                `Error processing row ${index + 1}:`,
                error.message
              );
              failureCount++;
              const errorMessage = `Row ${index + 1}: ${error.message}`;
              errors.push(errorMessage);
              setFailureNumber(failureCount);
              setErrorMessages((prev) => [...prev, errorMessage]);
            }

            index++;
          }, 3000); // 3-second interval
        } catch (error) {
          console.error("Error fetching existing data:", error.message);
          alert("Failed to fetch existing data. Please try again.");
          setIsUploading(false);
        }
      } else {
        alert("API Url Not Found");
      }
    },
    [apiUrl]
  );

  return {
    isUploading,
    successNumber,
    failureNumber,
    errorMessages,
    successMessages,
    postData,
  };
};

export default usePostData;
