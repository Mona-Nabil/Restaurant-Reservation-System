import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { listReservations, listTables } from "../utils/api";
import ReservationsList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const loadReservations = useCallback(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }, [date]);

  const loadTables = useCallback(() => {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }, []);

  const loadReservationsAndTables = useCallback(() => {
    loadReservations();
    loadTables();
  }, [loadReservations, loadTables]);

  useEffect(() => {
    loadReservationsAndTables();
  }, [date, loadReservationsAndTables]);


  // useEffect(() => {
  //   loadReservationsAndTables();
  // }, [date]);

  // function loadReservations() {
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   listReservations({ date }, abortController.signal)
  //     .then(setReservations)
  //     .catch(setReservationsError);
  //   return () => abortController.abort();
  // }

  // function loadTables() {
  //   const abortController = new AbortController();
  //   setTablesError(null);
  //   listTables(abortController.signal)
  //     .then(setTables)
  //     .catch(setTablesError);
  //   return () => abortController.abort();
  // }

  // function loadReservationsAndTables() {
  //   const abortController = new AbortController();
  //   loadReservations();
  //   loadTables();
  //   return () => abortController.abort();
  // }

  return (
    <main className="dashboard">
      <div className="headingBar d-md-flex my-3 p-2">
        <h1>Dashboard</h1>
      </div>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/dashboard?date=${previous(date)}`}>Previous Day</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Today
          </li>
          <li className="breadcrumb-item">
            <Link to={`/dashboard?date=${next(date)}`}>Next Day</Link>
          </li>
        </ol>
      </nav>

      <div className="reservations-list">
        <h4>Reservations for {date}</h4>
        <ReservationsList
          reservations={reservations}
          setReservationsError={setReservationsError}
          reservationsError={reservationsError}
          loadReservationsAndTables={loadReservationsAndTables}
        />
      </div>

      <div className="tables-list">
        <div className="headingBar my-3 p-2">
          <h4>Tables</h4>
        </div>

        {!tables && <h5 className="load-message">Loading...</h5>}
        <ErrorAlert error={tablesError} setError={setTablesError} />
        <TableList
          tables={tables}
          setTablesError={setTablesError}
          loadReservationsAndTables={loadReservationsAndTables}
        />
      </div>
    </main>
  );
}

export default Dashboard;
