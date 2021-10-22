import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
function Audit() {
  useEffect(() => {
    allHead();
  }, []);
  const [head, setHead] = useState([]);
  const [headLength, setheadLength] = useState(0);
  const [headData, setHeadData] = useState([]);
  const [HOFLength, setHOFLength] = useState(0);

  const allHead = () => {
    axios.get("/head").then((res) => {
      setHead(res.data.response);
      setheadLength(res.data.length);
    });
  };

  const handleHeadOfFuncChange = (e) => {
    const value = e.target.value;
    if (value !== "") {
      axios
        .get(`/byhof/${value}`)
        .then((res) => {
          setHeadData(res.data.response);
          setHOFLength(res.data.length);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      <div>
        <div className="row">
          <div className="col">
            <select
              name="hof"
              id="hof"
              className="selector"
              onChange={handleHeadOfFuncChange}
            >
              <option value="">Select HOF</option>
              {head.map((_) => {
                return (
                  <option key={_.id} value={_.head_of_function}>
                    {_.head_of_function}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col">
            <div style={{ marginTop: "20px" }}>
              total Head: {headLength} & head data: {HOFLength}
            </div>
          </div>
        </div>
        {headData.map((_) => {
          return (
            <div className="row" key={_.id}>
              <div className="col">
                <input
                  type="text"
                  disabled
                  value={_.department}
                  className="selector"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  disabled
                  value={_.work_location}
                  className="selector"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  disabled
                  value={_.spoc}
                  className="selector"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Audit;
