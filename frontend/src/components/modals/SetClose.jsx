import React, { useState } from "react";
import axios from "axios";
const SetClose = ({ userId }) => {
  const [close, setClose] = useState(false);

  const toggle = async (e) => {
    const checked = e.target.checked;
    setClose(checked);

    await axios.post("/api/users/toggle", { userId, toggle: e.target.checked });
  };

  return (
    <div>
      {/* {userId} */}
      <label>
        <input type="checkbox" checked={close} onChange={toggle} />
        검색 허용
      </label>
    </div>
  );
};

export default SetClose;
