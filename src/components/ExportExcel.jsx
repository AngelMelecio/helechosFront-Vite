import React from "react";
import { utils, writeFile } from "xlsx";

const ExportToExcel = ({ data }) => {
  const handleClick = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "data.xlsx");
  };

  return <button onClick={handleClick}>Export to Excel</button>;
};

export default ExportToExcel;
