# weather-panel

## Javascript: Display weather parameters

A Javascript project with HTML to display weather parameters, such as temperature, humidity,
wind speed and uv index of the "local" area. Related projects are in weather-data and
subscribe-data. Each project is independent from each other, and there is duplicated source
code database interaction.

There is no need to set up web server, it is running on NodeJS. The goal is to demonstrate some
of the great features of Javascript (NodeJS). It is not meant to be production qualify.

This project and the two mentioned are recreated from the nodered_weather project. Notered is
a simple drag and drop visual programming tool to create logic flow. It has a rich 3rd party
free library to support various functions.

### Configuration
1. Update the configuration file on config/main.evn to your local environment
2. Create an optional config/dev.env file for local test

## Notes
1. The data source can be MySQL or MongoDB, even create connection to other database. Check out the
end points in src/app.js for getting data.