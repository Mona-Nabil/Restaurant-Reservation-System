import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservations/CreateReservation";
import EditReservation from "../reservations/EditReservation";
import Seat from "../seats/Seat";
import Search from "../search/Search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateTable from "../tables/CreateTable";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>

      <Route path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>

      <Route path="/tables/new">
        <CreateTable />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
