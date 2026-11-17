import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function StudyRecords() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchRecords = async () => {
    const res = await fetch("http://localhost:8080/api/records", {
      headers: { Authorization: "Bearer logged-in" },
    });
    if (res.ok) {
      const data = await res.json();
      setRecords(data);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecords();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:8080/api/records/${editId}`
      : "http://localhost:8080/api/records";
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, title, time: Number(time) }),
    });

    setDate("");
    setTitle("");
    setTime("");
    setEditId(null);
    fetchRecords();
  };
  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/records/${id}`, {
      method: "DELETE",
    });
    fetchRecords();
  };
  const handleEdit = (rec) => {
    setEditId(rec.id);
    setDate(rec.data);
    setTitle(rec.title);
    setTime(rec.time);
  };

  const total = records.reduce((sum, r) => sum + (Number(r.time) || 0), 0);

  return (
    <div>
      <h2>Study Records</h2>
      <Calendar />
      <p>合計学習時間 : {total}分</p>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>
      <ul>
        {records.map((rec) => (
          <li key={rec.id}>
            {rec.date} / {rec.title} / {rec.time}m
            <button onClick={() => handleEdit(rec)}>Edit</button>
            <button onClick={() => handleDelete(rec.id)}>Del</button>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudyRecords;
