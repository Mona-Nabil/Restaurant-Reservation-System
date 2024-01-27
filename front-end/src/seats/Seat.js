import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Seat.css"

function Seat() {
  // Extract reservation_id from the URL parameters
  const { reservation_id } = useParams();
  const history = useHistory();

  // State variables
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [selectedTable, setSelectedTable] = useState({
    reservation_id: reservation_id,
  });

  // Effect to load tables from the server
  useEffect(() => {
    async function loadTables() {
      const response = await listTables();
      setTables(response);
    }
    loadTables();
  }, []);
  
  // Effect to load reservation details based on reservation_id
  useEffect(() => {
    async function loadReservation() {
      const response = await readReservation(reservation_id);
      setReservation(response);
    }
    loadReservation();
  }, [reservation_id]);

  // Handle changes in the table selection dropdown
  const handleChange = ({ target }) => {
    setSelectedTable({ ...selectedTable, [target.name]: target.value });
  }

  // Handle form submission, update table and navigate to the dashboard
  const handleSubmit = (event) => {
    event.preventDefault();
    updateTable(reservation_id, selectedTable.table_id, selectedTable)
      .then(() => history.push("/dashboard"))
      .catch((error) => setError(error));
  }

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h1>Seating</h1>
      </div>

      <ErrorAlert error={error} setError={setError} />

      <form onSubmit={handleSubmit}>
        <label htmlFor="table-select" className="table-select">
          <h4>
            Assign a table for reservation 
            #{reservation_id}: {reservation.first_name} {reservation.last_name}, 
            for {reservation.people} people:
          </h4>
        </label>
        <div className="selections">
          <select 
            name="table_id" 
            id="table-select"
            onChange={handleChange}>
          <option value="">- Please choose a table -</option>
          {tables.map((table) => (
            <option value={table.table_id} key={table.table_name}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
          </select>
        </div>

        <div className="form-buttons">
          <button 
            type="submit"
            className="btn btn-primary btn-lg">
              Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => history.go(-1)}>
              Cancel
          </button>
        </div>

      </form>
    </main>
  );
}

export default Seat;
