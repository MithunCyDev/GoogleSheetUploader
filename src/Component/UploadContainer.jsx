import React from "react";
import { Button } from "../Utils/Utils";

export const UploadContainer = ({
  postData,
  sheetData,
  isUploading,
  setApiUrl,
  setTabLocation,
  setStatusName,
  successNumber,
  failureNumber,
}) => {
  return (
    <div className="bdUploadContainer">
      <div>
        <Button
          children={"Upload Data in DB"}
          onClick={postData}
          disabled={sheetData.length === 0 || isUploading}
          backgroundColor={"#f87171"}
        />
        <input
          onChange={(e) => setApiUrl(e.target.value)}
          className="apiUrl"
          placeholder="Past Your API URL api/userName"
        />
        <input
          onChange={(e) => setTabLocation(e.target.value)}
          className="location"
          placeholder="Tab Location Name"
        />
        <input
          onChange={(e) => setStatusName(e.target.value)}
          className="status"
          placeholder="Status"
        />
      </div>
    </div>
  );
};
