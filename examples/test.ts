import { HorseRacingAPI, FootballAPI } from '../src';

// Initialize APIs directly - client is created automatically
const horseRacingAPI = new HorseRacingAPI();
const footballAPI = new FootballAPI();

// Fetch horse racing data

horseRacingAPI.getRace(1).then(data => {
    console.log(data);
});