import React, { Component } from "react";
import "./App.css";
import CitySearch from "./CitySearch";
import EventList from "./EventList";
import NumberOfEvents from "./NumberOfEvents";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <EventList />
        <CitySearch />
        <NumberOfEvents />
      </div>
    );
  }
}

export default App;
