import { useEffect, useState } from "react";
import axios from "axios";

const UserHistory = () => {
  const [dataSources, setDataSources] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/datasources/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDataSources(res.data);
      } catch (err) {
        console.error("Erreur de récupération des fichiers :", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="text-sm p-2 bg-gray-50 border-t">
      <h4 className="font-semibold mb-1">Mes importations</h4>
      <ul className="space-y-1">
        {dataSources.slice(0, 5).map(ds => (
          <li key={ds.id} className="text-gray-600">
            <span className="font-medium">{ds.filename}</span><br />
            <span className="text-xs">{new Date(ds.import_date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHistory;
