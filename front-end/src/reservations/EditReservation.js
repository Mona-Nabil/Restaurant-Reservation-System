import React, { useState, useEffect } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
  const history = useHistory();
  const {reservation_id} = useParams()

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState("");

  // load reservations by id
  useEffect(() => {
    async function loadReservation() {
      const response = await readReservation(reservation_id);
      setReservation(response);
    }
    loadReservation();
  }, [reservation_id]);

  // change and submit handlers

  const handleChange = ({ target }) => {
    setReservation({ ...reservation, [target.name]: target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    updateReservation(reservation, abortController.signal)
      .then(() =>
        history.push(
          // maybe slice()?
          `/dashboard?date=${reservation.reservation_date.slice(0, 10)}`
        )
      )
      .catch((error) => setError(error));

    return () => abortController.abort();
  };

  return (
    <main>
      <div className="d-md-flex mb-3 flex-column">
        <h1>Edit Reservation</h1>
        <ErrorAlert error={error} setError={setError} />
      </div>

      <ReservationForm
        reservation={reservation}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </main>
  );
}

export default EditReservation;
