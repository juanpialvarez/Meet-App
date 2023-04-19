import React, { Component } from "react";
import "./App.css";
import CitySearch from "./CitySearch";
import EventList from "./EventList";
import NumberOfEvents from "./NumberOfEvents";
import WelcomeScreen from "./WelcomeScreen";
import { getEvents, extractLocations, getAccessToken, checkToken } from "./api";
import "./nprogress.css";
import { ErrorAlert } from "./Alert";
import {
  ScatterChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Legend,
  Scatter,
  Tooltip,
  // ResponsiveContainer,
} from "recharts";
import EventGenre from "./EventGenre";

class App extends Component {
  state = {
    events: [],
    eventData: [],
    locations: [],
    eventCount: 32,
    selectedCity: null,
    errorText: "",
    showWelcomeScreen: undefined,
    data: [],
  };

  getData = (locations, events) => {
    const data = locations.map((location) => {
      const number = events.filter(
        (event) => event.location === location
      ).length;
      const city = location.split(", ").shift();
      return { city, number };
    });
    return data;
  };

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem("access_token");
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    // let code = localStorage.getItem("code");
    // code = JSON.parse(code);
    const authorized = code || isTokenValid;
    const isLocal = window.location.href.indexOf("localhost") > -1;
    this.setState({ showWelcomeScreen: !authorized && !isLocal });
    if ((authorized || isLocal) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events: events,
            eventData: events,
            locations: extractLocations(events),
            data: this.getData(extractLocations(events), events),
          });
        }
      });
    }

    if (!navigator.onLine) {
      this.setState({
        errorText: "The app is using cached data",
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, eventCount) => {
    if (!eventCount) {
      getEvents().then((events) => {
        const locationEvents =
          location === "all"
            ? events
            : events.filter((event) => event.location === location);
        const shownEvents = locationEvents.slice(0, this.state.eventCount);
        this.setState({
          events: shownEvents,
          selectedCity: location,
        });
      });
    } else if (eventCount && !location) {
      getEvents().then((events) => {
        const locationEvents = events.filter((event) =>
          this.state.locations.includes(event.location)
        );
        const shownEvents = locationEvents.slice(0, eventCount);
        this.setState({
          events: shownEvents,
          eventCount: eventCount,
        });
      });
    } else if (this.state.selectedCity === "all") {
      getEvents().then((events) => {
        const locationEvents = events;
        const shownEvents = locationEvents.slice(0, eventCount);
        this.setState({
          events: shownEvents,
          eventCount: eventCount,
        });
      });
    } else {
      getEvents().then((events) => {
        const locationEvents =
          this.state.locations === "all"
            ? events
            : events.filter(
                (event) => this.state.selectedCity === event.location
              );
        const shownEvents = locationEvents.slice(0, eventCount);
        this.setState({
          events: shownEvents,
          eventCount: eventCount,
        });
      });
    }
  };

  render() {
    if (this.state.showWelcomeScreen === undefined)
      return <div className='App' />;
    return (
      <div className='App'>
        <ErrorAlert text={this.state.errorText} />
        <br />
        <br />
        <CitySearch
          locations={this.state.locations}
          updateEvents={this.updateEvents}
        />
        <NumberOfEvents
          selectedCity={this.state.selectedCity}
          query={this.state.eventCount}
          updateEvents={this.updateEvents}
        />
        <div>
          <EventGenre events={this.state.eventData} />
          {/* <ResponsiveContainer height={400}> */}
          <ScatterChart
            height={400}
            width={800}
            margin={{
              top: 20,
              right: 20,
              bottom: 10,
              left: 10,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='city' type='category' name='city' />
            <YAxis dataKey='number' type='number' name='# of events' />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter data={this.state.data} fill='#8884d8' />
          </ScatterChart>
          {/* </ResponsiveContainer> */}
        </div>
        <EventList events={this.state.events} />
        <WelcomeScreen
          showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
      </div>
    );
  }
}

export default App;
