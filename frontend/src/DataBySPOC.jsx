import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
function Audit() {
  useEffect(() => {
    allSPOC();
  }, []);
  const [spoc, setSPOC] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [SPOCLength, setSPOCLength] = useState(0);
  const [headDataLength, setheadDataLength] = useState(0);

  const allSPOC = () => {
    axios.get("/spoc").then((res) => {
      setSPOC(res.data.response);
      setSPOCLength(res.data.length);
    });
  };

  const handleSPOCChange = (e) => {
    const value = e.target.value;
    if (value !== "") {
      axios
        .get(`/byspoc/${value}`)
        .then((res) => {
          setHeadData(res.data.response);
          setheadDataLength(res.data.length);
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
              onChange={handleSPOCChange}
            >
              <option value="">Select SPOC</option>
              {spoc.map((_) => {
                return (
                  <option key={_.id} value={_.spoc}>
                    {_.spoc}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col">
            <div style={{ marginTop: "20px" }}>
              Total SPOC: {SPOCLength} & Other data: {headDataLength}
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
                  value={_.head_of_function}
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
