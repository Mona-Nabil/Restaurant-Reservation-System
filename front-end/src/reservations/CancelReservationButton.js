// Import React library
import React from "react";

import { cancelReservation } from "../utils/api";

// Functional component for Cancel Reservation Button
function CancelReservationButton({
  reservation_id,
  setReservationsError,
  loadReservationsAndTables,
}) {
  // Event handler for button click
  const okHandler = (event) => {
    event.preventDefault();

    // Display confirmation message
    const message =
      "Do you want to cancel this reservation? This cannot be undone.";

    // Display confirmation dialog, and proceed if user clicks "OK"
    if (window.confirm(message)) {
      // Call the cancelReservation API function with reservation_id and status "cancelled"
      cancelReservation(reservation_id, "cancelled")
        // Reload reservations and tables after successful cancellation
        .then(() => loadReservationsAndTables())
        // Handle error if cancellation fails
        .catch(setReservationsError);
    }
  };

  // Render a button with a click event listener
  return (
    <>
      <button
        type="button"
        className="btn btn-danger"
        onClick={okHandler}
        data-reservation-id-cancel={reservation_id}
      >
        Cancel
      </button>
    </>
  );
}

export default CancelReservationButton;
