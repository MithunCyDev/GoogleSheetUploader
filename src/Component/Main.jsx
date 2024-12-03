import React, { useState } from "react";
import "../App.css";
import { Button } from "../Utils/Utils";
import { UploadContainer } from "./UploadContainer";
import useFileUpload from "../Hooks/useFileUpload";
import useJSONDownload from "../Hooks/useJSONDownload";
import usePostData from "../Hooks/usePostData";

const Main = () => {
  const [tabLocation, setTabLocation] = useState("");

  const [apiUrl, setApiUrl] = useState("");
  const [statusName, setStatusName] = useState("");

  // Define expected headers
  const expectedHeaders = [
    "Missed Pick/Del",
    "PO#",
    "Supplier",
    "PO Date",
    "Trader",
    "Pickup City",
    "Pick City/ST",
    "Ready",
    "Status",
    "Commodity",
    "Orig Loads",
    "Loads",
    "Additional Notes",
    "Notes",
    "location",
    "cd",
    "delivery_date",
  ];

  const { loading, sheetData, setSheetData, handleFileUpload } = useFileUpload(
    expectedHeaders,
    tabLocation,
    statusName
  );

  const { handleDownloadJSON } = useJSONDownload(sheetData);

  // POST Request Function
  const {
    isUploading,
    successNumber,
    failureNumber,
    errorMessages,
    successMessages,
    postData,
  } = usePostData(apiUrl);

  const handleUpload = () => {
    postData(sheetData);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Google Sheet Data Uploader</h1>
        <span>Upload your CSV file</span>
      </div>
      <div className="container">
        <div
          style={{
            backgroundColor: "#14223c",
            paddingTop: "10px",
            width: "60%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
          }}
        >
          <div className="inputDiv">
            {/* Upload Section */}
            <input
              className="uploadInput"
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={isUploading || tabLocation === ""}
            />
          </div>
          <div className="buttonDiv">
            <Button
              children={" Download JSON"}
              onClick={handleDownloadJSON}
              disabled={sheetData.length === 0 || isUploading}
              backgroundColor={"#6ed895"}
            />

            <Button
              children={"Clear Data"}
              onClick={() => setSheetData([])}
              disabled={isUploading}
              backgroundColor={"#d50f0f"}
            />
          </div>
          <UploadContainer
            postData={handleUpload}
            sheetData={sheetData}
            isUploading={isUploading}
            setApiUrl={setApiUrl}
            setTabLocation={setTabLocation}
            setStatusName={setStatusName}
            successNumber={successNumber}
            failureNumber={failureNumber}
          />

          {/* Show Status */}
          {isUploading && <p>Uploading data in DB... Please wait.</p>}
          <div className="successMessage">
            {(!isUploading || !successMessages) && <p>Success Message</p>}
            {isUploading && (
              <div className="numberCount">
                <h2 className="numberCountSuccess"> Success {successNumber}</h2>
              </div>
            )}
            {successMessages.map((e) => (
              <span className="errorList">{e}</span>
            ))}
          </div>

          <div className="errorMessage">
            {(!isUploading || !errorMessages) && <p>Error Message</p>}
            {isUploading && (
              <div className="numberCount">
                <h2 className="numberCountfailure">
                  {failureNumber} Upload Fail
                </h2>
              </div>
            )}
            {errorMessages.map((e) => (
              <span className="errorList">{e}</span>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "50%",
            padding: "30px",
          }}
        >
          {/* Preview Data */}
          {sheetData.length > 0 && (
            <div style={{ marginTop: "20px", textAlign: "left" }}>
              <div className="datafound">
                Total Data
                <h4>{sheetData.length}</h4>
              </div>
              <h3>JSON Data:</h3>
              <div
                style={{
                  overflowY: "scroll",
                  height: "100vh",
                  color: "#f87171",
                }}
              >
                <pre>{JSON.stringify(sheetData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
