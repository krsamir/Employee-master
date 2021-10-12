import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import axios from "axios";
function Audit() {
  const [data, setdata] = useState([]);
  useEffect(() => {
    axios
      .get("/audit")
      .then((res) => {
        setdata(res.data.response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const gridOptions = {
    pagination: true,
    overlayNoRowsTemplate: "<h3>Loading...</h3>",
    paginationPageSize: 10,
  };
  return (
    <div style={{ marginLeft: "100px" }}>
      <div className="ag-theme-alpine" style={{ height: 520, width: 900 }}>
        <AgGridReact
          rowData={data}
          animateRows={true}
          defaultColDef={{
            filter: true,
            resizable: true,
            sortable: true,
          }}
          gridOptions={gridOptions}
        >
          <AgGridColumn field="id" headerName="ID" width={70}></AgGridColumn>
          <AgGridColumn
            field="emp_id"
            headerName="Emp. Code"
            width={150}
          ></AgGridColumn>
          <AgGridColumn
            field="transaction"
            headerName="Transaction"
          ></AgGridColumn>
          <AgGridColumn
            field="updated_at"
            headerName="Updated at"
            width={450}
            valueGetter={(params) => {
              return new Date(params.data.updated_at);
            }}
          ></AgGridColumn>
        </AgGridReact>
      </div>
    </div>
  );
}

export default Audit;
