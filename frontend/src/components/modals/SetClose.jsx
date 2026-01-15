import { useState, useEffect } from "react";
import axios from "axios";
const SetClose = ({ userId }) => {
  const [pickUser, setPickUser] = useState([]);

  const fetchUsers = async () => {
    const users = await axios.get("/api/companion/getUsers");
    console.log(users.data.users);
    setPickUser(users.data?.users?.map((user) => user.id) ?? []);
  };

  const getUsers = async (e) => {
    await axios.post("/api/companion/toggle", {
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
        <img src="/public/assets/icons/toggle_on.png" width="60px" />
      ) : (
        <img src="/public/assets/icons/toggle_off.png" width="60px" />
      )}
      <label>
        <input
          type="checkbox"
          checked={pickUser.includes(userId)}
          onChange={getUsers}
          style={{ display: "none", userSelect: "none" }}
        />
        {pickUser.includes(userId) ? "Public" : "Private"}
      </label>
    </div>
  );
};

export default SetClose;
