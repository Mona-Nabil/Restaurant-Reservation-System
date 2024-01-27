// Import React library
import React from "react";

// Import CancelReservationButton component
import CancelReservationButton from "./CancelReservationButton";
import "./ReservationCard.css"

// Functional component for Reservation Card
function ReservationCard({
  reservation_id,
  first_name,
  last_name,
  mobile_number,
  reservation_date,
  reservation_time,
  people,
  status,
  setReservationsError,
  loadReservationsAndTables,
}) {
  // Render reservation card with details and actions
  return (
    <div className="card h-100 w-100 mb-3">
      {/* Reservation Header */}
      <h4 className="card-header d-flex justify-content-between align-itmes-center">
        {last_name}, {first_name}

        {/* Edit button (visible only for "booked" status) */}
        {status === "booked" && (
          <a
            type="button"
            className="btn btn-outline-secondary"
            href={`/reservations/${reservation_id}/edit`}
          >
            Edit
          </a>
        )}
      </h4>

      {/* Reservation Body */}
      <div className="card-body">
        <h5 className="card-title">
          {reservation_time}, {reservation_date}
        </h5>
        <h6 className="card-subtitle mb-2 test-muted">Guests: {people}</h6>
        <h6 className="card-subtitle mb-2 test-muted">
          Mobile Number: {mobile_number}
        </h6>
      </div>

      {/* Reservation Footer */}
      <div
        className="card-footer border-secondary text-secondary"
        id="resCardFooter"
      >
        {/* Seat button (visible only for "booked" status) */}
        {status === "booked" && (
          <a
            className="btn btn-secondary"
            id="seatButton"
            href={`/reservations/${reservation_id}/seat`}
            role="button"
          >
            Seat
          </a>
        )}

        {/* Reservation Status */}
        <h5>
          <span
            className="badge text-light"
            id="statusBadge"
            data-reservation-id-status={reservation_id}
          >
            {status}
          </span>
        </h5>

        {/* Cancel reservation button (visible only for "booked" status) */}
        {status === "booked" && (
          <CancelReservationButton
            reservation_id={reservation_id}
            setReservationsError={setReservationsError}
            loadReservationsAndTables={loadReservationsAndTables}
          />
        )}
      </div>
    </div>
  );
}

// Export the ReservationCard component as the default export
export default ReservationCard;
