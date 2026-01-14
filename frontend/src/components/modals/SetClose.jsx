import { useState, useEffect } from "react";
import axios from "axios";
const SetClose = ({ userId }) => {
  const [pickUser, setPickUser] = useState([]);

  const fetchUsers = async () => {
    const users = await axios.get("/api/users/getUsers");
    console.log(users.data.users);
    setPickUser(users.data?.users?.map((user) => user.id) ?? []);
  };

  const getUsers = async (e) => {
    await axios.post("/api/users/toggle", {
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
    <div>
      {/* {userId} */}
      <label>
        <input
          type="checkbox"
          checked={pickUser.includes(userId)}
          onChange={getUsers}
        />
        검색 허용
      </label>
    </div>
  );
};

export default SetClose;
