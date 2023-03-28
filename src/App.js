import React, { Component } from "react";
import "./App.css";
import CitySearch from "./CitySearch";
import EventList from "./EventList";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <EventList />
        <CitySearch />
      </div>
    );
  }
}

export default App;
