import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import axios from "axios";
import "./Table.css";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
function Table(props) {
  const resetData = {
    SPOC: "",
    department: "",
    employee_code: "",
    employee_name: "",
    head_of_function: "",
    id: "",
    work_location: "",
  };
  const [empData, setempData] = useState({ length: 0, response: [] });
  const [gridApi, setGridApi] = useState([]);
  const [deleteData, setdeleteData] = useState(resetData);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showAddAndUpdate, setShowAddannUpdate] = useState(false);
  const handleCloseAddAndUpdate = () => setShowAddannUpdate(false);
  const handleShowAddAndUpdate = () => setShowAddannUpdate(true);

  const [flag, setflag] = useState(true);
  const [getdepartment, setdepartment] = useState([]);
  const [getlocation, setlocation] = useState([]);
  const [gethof, sethof] = useState([]);
  const [getspoc, setspoc] = useState([]);

  const [create, setcreate] = useState({
    id: "",
    empCode: "",
    empName: "",
    location: "",
    dept: "",
    hof: "",
    spoc: "",
  });
  // const [columnApi, setColumnApi] = useState([]);
  useEffect(() => {
    const callFunctions = async () => {
      await axios
        .get("/getemp")
        .then((res) => {
          setempData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const loadDropDowns = async () => {
      await axios
        .get("/department")
        .then((res) => {
          setdepartment(res.data.response);
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get("/head")
        .then((res) => {
          sethof(res.data.response);
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get("/location")
        .then((res) => {
          setlocation(res.data.response);
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get("/spoc")
        .then((res) => {
          setspoc(res.data.response);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    callFunctions();
    setTimeout(() => {
      loadDropDowns();
    }, 500);
  }, []);
  const rowData = empData.response;
  const onGridReady = (params) => {
    setGridApi(params.api);
    // setColumnApi(params.columnApi);
  };
  const gridOptions = {
    pagination: true,
    overlayNoRowsTemplate: "<h3>Loading...</h3>",
    paginationPageSize: 10,
    onGridReady,
  };

  const handleDeleteRenderer = (params) => {
    const eGui = document.createElement("div");
    eGui.innerHTML = `<span class="dot">X</span>`;

    const deleteButton = eGui.querySelector(".dot");

    deleteButton.addEventListener("click", () => handleDelete(params));
    return eGui;
  };
  const getRowNodeId = (data) => data.id;
  const handleDelete = (params) => {
    setdeleteData(params.data);
    handleShow();
  };

  const handleEditRenderer = (params) => {
    const eGui = document.createElement("div");
    eGui.innerHTML = `<span class="dot">O</span>`;

    const editButton = eGui.querySelector(".dot");

    editButton.addEventListener("click", () => handleEdit(params));
    return eGui;
  };
  const handleEdit = (params) => {
    const {
      SPOC,
      department,
      employee_code,
      employee_name,
      head_of_function,
      id,
      work_location,
    } = params.data;
    setcreate({
      id,
      empCode: employee_code,
      empName: employee_name,
      location: work_location,
      dept: department,
      hof: head_of_function,
      spoc: SPOC,
    });
    setflag(false);
    handleShowAddAndUpdate();
  };
  const FilterParams = {
    buttons: ["reset"],
    debounceMs: 200,
  };

  const handleChange = (e) => {
    const val = { ...create };
    val[e.target.name] = e.target.value;
    setcreate(val);
  };

  const handleCreate = () => {
    let val = { ...create };
    delete val.id;
    const upValue = {
      id: create.id,
      employee_code: create.empCode,
      employee_name: create.empName,
      work_location: create.location,
      department: create.dept,
      head_of_function: create.hof,
      SPOC: create.spoc,
    };
    axios
      .post("/create", [val])
      .then((res) => {
        gridApi.applyTransaction({ add: [{ id: res.data.id, ...upValue }] });
        handleCloseAddAndUpdate();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleUpdate = () => {
    const upValue = {
      id: create.id,
      employee_code: create.empCode,
      employee_name: create.empName,
      work_location: create.location,
      department: create.dept,
      head_of_function: create.hof,
      SPOC: create.spoc,
    };
    axios
      .put("/update", create)
      .then((res) => {
        gridApi.applyTransaction({ update: [upValue] });
        handleCloseAddAndUpdate();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const {
    SPOC,
    department,
    employee_code,
    employee_name,
    head_of_function,
    id,
    work_location,
  } = deleteData;
  const deleteRow = async (deleteData) => {
    await axios
      .delete(`/delete/${deleteData.id}`)
      .then((res) => {
        if (res.data.rows === 1) {
          gridApi.applyTransaction({ remove: [{ id: deleteData.id }] });
          handleClose();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="table">
      <div className="top">
        <div className="createButton">
          <Button
            variant="primary"
            className="create"
            onClick={() => {
              setflag(true);
              handleShowAddAndUpdate();
            }}
          >
            <span className="plus">+</span>Create
          </Button>
        </div>
        <div className="searchBar">
          <Form.Group controlId="formSearch">
            <Form.Control
              type="text"
              placeholder="Search..."
              onChange={(e) => gridApi.setQuickFilter(e.target.value)}
              autoFocus={true}
            />
          </Form.Group>
        </div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 520, width: 1200 }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={rowData}
          animateRows={true}
          defaultColDef={{
            filter: true,
            resizable: true,
            sortable: true,
            filterParams: FilterParams,
          }}
          getRowNodeId={getRowNodeId}
        >
          <AgGridColumn
            field="id"
            headerName="ID"
            width={70}
            sort="asc"
          ></AgGridColumn>
          <AgGridColumn
            field="employee_code"
            headerName="Emp. Code"
            width={150}
          ></AgGridColumn>
          <AgGridColumn field="employee_name" headerName="Name"></AgGridColumn>
          <AgGridColumn
            field="work_location"
            headerName="Location"
          ></AgGridColumn>
          <AgGridColumn
            field="department"
            headerName="Department"
          ></AgGridColumn>
          <AgGridColumn
            field="head_of_function"
            headerName="HOF"
          ></AgGridColumn>
          <AgGridColumn field="SPOC" headerName="SPOC"></AgGridColumn>
          <AgGridColumn
            field="delete"
            headerName="Delete"
            width={100}
            cellRenderer={handleDeleteRenderer}
          ></AgGridColumn>
          <AgGridColumn
            field="edit"
            headerName="Edit"
            width={100}
            cellRenderer={handleEditRenderer}
          ></AgGridColumn>
        </AgGridReact>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        onExit={() => {
          setdeleteData(resetData);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>
            Are you sure to delete the entry with the following Details:-
          </pre>
          <ul>
            <li>
              ID: <strong>{id}</strong>{" "}
            </li>
            <li>
              Employee Code: <strong>{employee_code}</strong>
            </li>
            <li>
              Employee Name: <strong>{employee_name}</strong>
            </li>
            <li>
              Head Of Function:<strong>{head_of_function}</strong>{" "}
            </li>
            <li>
              Department:<strong>{department}</strong>{" "}
            </li>
            <li>
              Work Location:<strong>{work_location}</strong>{" "}
            </li>
            <li>
              SPOC: <strong>{SPOC}</strong>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deleteRow(deleteData)}>Yes</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddAndUpdate}
        onHide={handleCloseAddAndUpdate}
        centered
        size="lg"
        onExit={() => {
          setcreate({
            id: "",
            empCode: "",
            empName: "",
            location: "",
            dept: "",
            hof: "",
            spoc: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create/Update
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridempcode">
              <Form.Label>Employee Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Employee Code"
                value={create.empCode}
                name="empCode"
                onChange={(e) => handleChange(e)}
                autoFocus={true}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={create.empName}
                name="empName"
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLocation">
              <Form.Label>Work Location</Form.Label>
              <Form.Select
                value={create.location}
                name="location"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Select</option>
                {getlocation.map((val) => {
                  return <option key={val.id}>{val.work_location}</option>;
                })}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={create.dept}
                name="dept"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Select</option>
                {getdepartment.map((val) => {
                  return <option key={val.id}>{val.department}</option>;
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridHof">
              <Form.Label>HOF</Form.Label>
              <Form.Select
                value={create.hof}
                name="hof"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Select</option>
                {gethof.map((val) => {
                  return <option key={val.id}>{val.head_of_function}</option>;
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridspoc">
              <Form.Label>SPOC</Form.Label>
              <Form.Select
                value={create.spoc}
                name="spoc"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Select</option>
                {getspoc.map((val) => {
                  return <option key={val.id}>{val.spoc}</option>;
                })}
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {flag && <Button onClick={handleCreate}>Save</Button>}
          {!flag && <Button onClick={handleUpdate}>Update</Button>}
          <Button onClick={handleCloseAddAndUpdate}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// const MyVerticallyCenteredModal = (props) => {

//   return (

//   );
// };
export default Table;
