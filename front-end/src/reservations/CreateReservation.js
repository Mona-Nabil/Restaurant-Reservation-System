import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";


function CreateReservation() {


  // Initial Form state
  const InitialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [reservation, setReservation] = useState({ ...InitialFormState });
  const history = useHistory();
  const [error, setError] = useState(null);
  // create handlers
  const handleChange = ({ target }) => {
    setReservation({ ...reservation, [target.name]: target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    try {
      // Create a new reservation
      const newReservation = await createReservation(reservation, abortController.signal);

      // Redirect to the dashboard for the reservation date
      history.push(`/dashboard?date=${newReservation.reservation_date.slice(0, 10)}`);
    } catch (error) {
      setError(error);
    } finally {
      // Clean up the abort controller
      abortController.abort();
    }
  }

  return (
    <main>
      <div className="d-md-flex flex-column mb-3">
        <h1>Create a New Reservation</h1>
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

export default CreateReservation;
