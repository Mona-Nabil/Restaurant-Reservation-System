import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initialFormState });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = ({ target }) => {
    setReservation({ ...reservation, [target.name]: target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
  
    try {
      const newReservation = await createReservation(
        reservation,
        abortController.signal
      );
  console.log(newReservation, reservation);
      // Redirect to the dashboard for the reservation date
      history.push(`/dashboard?date=${reservation.reservation_date.slice(0, 10)}`);
    } catch (error) {
      setError(error);
    } finally {
      abortController.abort();
    }
  };
  

  return (
    <main>
      <div className="d-md-flex flex-column mb-3">
        <h1>Create a New Reservation</h1>
        <ErrorAlert error={error} setError={setError} />
      </div>

      {/* Only render the form if it hasn't been submitted */}
      {!formSubmitted && (
        <ReservationForm
          reservation={reservation}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      )}
    </main>
  );
}

export default CreateReservation;
