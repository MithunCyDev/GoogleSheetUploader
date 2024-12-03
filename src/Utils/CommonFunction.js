export const DateFormatter = (dateValue) => {
  if (!dateValue) return null;

  // Check if the value is an Excel serial date (number)
  if (typeof dateValue === "number") {
    const excelEpoch = new Date(1899, 11, 30); // Excel's epoch start date
    const dateInMs = dateValue * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const correctedDate = new Date(excelEpoch.getTime() + dateInMs);

    const year = correctedDate.getUTCFullYear();
    const month = String(correctedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(correctedDate.getUTCDate() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Handle standard date strings or invalid inputs
  const parsedDate = new Date(dateValue);
  if (!isNaN(parsedDate)) {
    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0"); // Adjust month
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  console.error("DateFormatter: Unable to parse dateValue.", dateValue);
  return null;
};
