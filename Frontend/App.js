import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [table, setTable] = useState([]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const getPostsData = () => {
      axios
        .get("http://localhost:3000/databases")
        .then((data) => setData(data.data))
        .catch((error) => console.log(error));
    };
    getPostsData();
  }, []);

  const fetchData = (name_database) => {
    axios
      .get(`http://localhost:3000/databases/${name_database}`)
      .then((data) => {
        setTable(data.data);
      })
      .catch((error) => console.log(error));
  };

  const getDataFomTable = (name_database, table) => {
    console.log("get data", name_database, table);
    axios
      .get(`http://localhost:3000/databases/${name_database}/${table}`)
      .then((data) => {
        setTableData(data.data);
      })
      .catch((error) => console.log(error));
  };

  const addData = async (newData) => {
    try {
      const response = await axios.post(
        "https://votre-api-restful.com/data",
        newData
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `https://votre-api-restful.com/data/${id}`
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateData = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `https://votre-api-restful.com/data/${id}`,
        updatedData
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Decepticon</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const nom = e.target.elements.nom.value;
          const description = e.target.elements.description.value;
          addData({ nom, description });
        }}
      >
        <label htmlFor="nom">Nom</label>
        <input type="text" id="nom" name="nom" />
        <label htmlFor="prenom">Prenom</label>
        <input type="text" id="prenom" name="prenom" />
        <label htmlFor="mail">Email</label>
        <input type="text" id="mail" name="mail" />
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Table</th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, key) => (
            <tr key={key}>
              <td onClick={() => fetchData(item)}>{item} </td>
              {table.map((tableName, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => getDataFomTable(item, tableName)}
                  >
                    {tableName}
                  </div>
                );
              })}

              <td>
                <input
                  type="text"
                  defaultValue={
                    tableData.data !== undefined ? tableData.data[0][0] : ""
                  }
                  onBlur={(e) => {
                    const updatedData = { nom: e.target.value };
                    updateData(item.id, updatedData);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={
                    tableData.data !== undefined ? tableData.data[0][1] : ""
                  }
                  onBlur={(e) => {
                    const updatedData = { nom: e.target.value };
                    updateData(item.id, updatedData);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={
                    tableData.data !== undefined ? tableData.data[0][2] : ""
                  }
                  onBlur={(e) => {
                    const updatedData = { nom: e.target.value };
                    updateData(item.id, updatedData);
                  }}
                />
              </td>

              <td>
                <button onClick={() => deleteData(item.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
