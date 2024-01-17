/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const { today } = require("../utils/date-time");

// Lists reservations by query data, mobile or today's date
async function list(req, res) {
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  } else {
    const data = await service.list(today());
    res.json({ data });
  }
}
// check data and valid properties

const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];
// has data handler

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "Body must have data property" });
}

// valid properties handler
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidProperties = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidProperties.length) {
    next({
      status: 400,
      message: `Invalid field(s): ${invalidProperties.join(", ")}`,
    });
  }
  next();
}
// has properties handler
function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A ${property} property is required`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

// valid date and time handlers

function hasValidDate(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
  const parsedDate = Date.parse(reservation_date);

  if (isNaN(parsedDate) || !reservation_date.match(dateRegex)) {
    return next({ status: 400, message: "reservation_date must be a valid date" });
  }

  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const timeRegex = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

  if (!reservation_time.match(timeRegex)) {
    return next({ status: 400, message: "reservation_time must be a valid time" });
  }

  next();
}
// people property is a number handler
function peopleIsNumber(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (!Number.isInteger(people)) {
    next({ status: 400, message: "people must be a number" });
  }
  next();
}

// restaurant is closed on Tuesday handler
function isNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const dateString = reservation_date.split("-");
  const numDate = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (numDate.getDay() === 2) {
    next({ status: 400, message: "restaurant is closed on Tuesdays" });
  } else {
    next();
  }
}

// reservation is in a future date handler
function isNotPastDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const [hour, minute] = reservation_time.split(":");
  let [year, month, day] = reservation_date.split("-");
  month -= 1;
  const reservationDate = new Date(year, month, day, hour, minute, 59, 59);
  const today = new Date();

  if (reservationDate <= today) {
    return next({
      status: 400,
      message: "reservation date and time must be set in the future",
    });
  }

  next();
}

// working hours handler
function isWithinBusinessHours(req, res, next) {
  const { reservation_time } = req.body.data;
  if (!(reservation_time >= "10:30" && reservation_time <= "21:30")) {
    return next({
      status: 400,
      message: "reservation time must be within appropriate business hours",
    });
  }

  next();
}

// Booked is the default status
function hasDefaultBookedStatus(req, res, next) {
  const { status } = req.body.data;
  if (!status || status === "") {
    req.body.data.status = "booked"; // Set default status to "booked"
  }
  next();
}

// valid status handler
function hasValidStatus(req, res, next) {
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (status && !validStatuses.includes(status)) {
    return next({
      status: 400,
      message: `Invalid status: '${status}'. Status must be either 'booked', 'seated', 'finished,' or 'cancelled.' `,
    });
  }
  next();
}

function isFinished(req, res, next) {
  const currentStatus = res.locals.reservation.status;
  if (currentStatus === "finished") {
    next({ status: 400, message: "A finished reservation cannot be updated." });
  } else {
    next();
  }
}

//  Create a new reservation
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data });
}

// check if given reservation exists
async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation ${reservation_id} does not exist`,
  });
}

// Read function
function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

// Update function
async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  create: [
    hasData,
    hasOnlyValidProperties,
    hasProperties(
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people"
    ),
    hasValidDate,
    hasValidTime,
    isWithinBusinessHours,
    isNotPastDate,
    peopleIsNumber,
    isNotTuesday,
    hasDefaultBookedStatus,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasData,
    hasOnlyValidProperties,
    hasProperties(
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people"
    ),
    hasValidDate,
    peopleIsNumber,
    hasValidTime,
    isNotTuesday,
    isNotPastDate,
    isWithinBusinessHours,
    hasDefaultBookedStatus,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    hasData,
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    isFinished,
    asyncErrorBoundary(update),
  ],
};
