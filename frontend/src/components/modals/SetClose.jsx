import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "/api";
const SetClose = ({ userId }) => {
  const [pickUser, setPickUser] = useState([]);

  const fetchUsers = async () => {
    const users = await axios.get(`${API_URL}/companion/getUsers`);
    console.log(users.data.users);
    setPickUser(users.data?.users?.map((user) => user.id) ?? []);
  };

  const getUsers = async (e) => {
    await axios.post(`${API_URL}/companion/toggle`, {
      userId,
      toggle: e.target.checked,
    });
    await fetchUsers();
  };
  useEffect(() => {
    setTimeout(() => {
      fetchUsers();
    }, 0);
  }, []);
  return (
    <div style={{ userSelect: "none", marginLeft: "auto" }}>
      {/* {userId} */}
      {pickUser.includes(userId) ? (
        <img src="/assets/icons/toggle_on.png" width="60px" />
      ) : (
        <img src="/assets/icons/toggle_off.png" width="60px" />
      )}
      <label
        style={{
          display: "inline-block",
          width: "120px",
          background: "transparent",
          textAlign: "right",
          position: "relative",
          left: "-60px",
          height: "25px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={pickUser.includes(userId)}
          onChange={getUsers}
          style={{ display: "none", userSelect: "none" }}
        />
        {pickUser.includes(userId) ? "공개" : "비 공개"}
      </label>
    </div>
  );
};

export default SetClose;
