import { HorseRacingAPI } from "../src";

const horseRacingAPI = new HorseRacingAPI();

(async () => {
    let data = await horseRacingAPI.getActiveMeetings();

    console.log(data)
})()