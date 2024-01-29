import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { listTables, readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Seat.css";

function Seat({ reservationId, tableId }) {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [selectedTable, setSelectedTable] = useState({
    reservation_id: reservation_id,
  });

  useEffect(() => {
    async function loadTables() {
      const response = await listTables();
      setTables(response);
    }
    loadTables();
  }, []);

  useEffect(() => {
    async function loadReservation() {
      const response = await readReservation(reservation_id);
      setReservation(response);
    }
    loadReservation();
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    setSelectedTable({ ...selectedTable, [target.name]: target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateTable(reservation_id, selectedTable.table_id, selectedTable)
      .then(() => history.push("/dashboard"))
      .catch((error) => setError(error));
  };

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h1>Seating</h1>
      </div>

      <ErrorAlert error={error} setError={setError} />

      <form onSubmit={handleSubmit}>
        <label htmlFor="table-select" className="table-select">
          <h4>
            Assign a table for reservation #{reservation_id}:{" "}
            {reservation.first_name} {reservation.last_name}, for{" "}
            {reservation.people} people:
          </h4>
        </label>
        <div className="selections">
          <select
            name="table_id"
            id="table-select"
            onChange={handleChange}
            value={selectedTable.table_id || ""}
          >
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
            className="btn btn-primary btn-lg"
            disabled={!selectedTable.table_id}
          >
            Submit
          </button>
          <Link to="/dashboard">
            <button type="button" className="btn btn-secondary btn-lg">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}

export default Seat;
