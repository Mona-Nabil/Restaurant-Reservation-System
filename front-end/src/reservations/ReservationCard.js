import React from "react";
import { Link } from "react-router-dom";
import CancelReservationButton from "./CancelReservationButton";
import "./ReservationCard.css";

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
  // console.log(typeof reservation_date);
  return (
    <div className="card reservation-card h-100 w-100 mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {last_name}, {first_name}
            </li>
          </ol>
        </nav>

        {status === "booked" && (
          <Link
            to={`/reservations/${reservation_id}/edit`}
            className="btn btn-outline-secondary"
          >
            Edit
          </Link>
        )}
      </div>

      <div className="card-body">
        <h5 className="card-title">{reservation_time}, {reservation_date}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Guests: {people}</h6>
        <h6 className="card-subtitle mb-2 text-muted">Mobile Number: {mobile_number}</h6>
      </div>

      <div className="card-footer border-secondary text-secondary" id="resCardFooter">
        {status === "booked" && (
          <Link
            to={`/reservations/${reservation_id}/seat`}
            className="btn btn-secondary"
            role="button"
          >
            Seat
          </Link>
        )}

        <h5>
          <span
            className="badge text-light"
            id="statusBadge"
            data-reservation-id-status={reservation_id}
          >
            {status}
          </span>
        </h5>

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

export default ReservationCard;
