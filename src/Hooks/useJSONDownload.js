import { useCallback } from "react";

const useJSONDownload = (data) => {
  const handleDownloadJSON = useCallback(() => {
    if (!data || data.length === 0) {
      alert("No data to download. Please upload a sheet first.");
      return;
    }

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sheetData.json";
    link.click();

    // Cleanup the URL object
    URL.revokeObjectURL(url);
  }, [data]);

  return { handleDownloadJSON };
};

export default useJSONDownload;
