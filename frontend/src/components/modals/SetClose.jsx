import React, { useState } from "react";

const SetClose = () => {
  const [close, setClose] = useState(false);

  const toggle = (e) => {
    const checked = e.target.checked;
    setClose(checked);
  };

  return (
    <div>
      <label>
        <input type="checkbox" checked={close} onChange={toggle} />
        검색 허용
      </label>
    </div>
  );
};

export default SetClose;
