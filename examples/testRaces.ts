import { HKJCClient } from '../src/client';
import { HorseRacingAPI } from '../src/modules/horseRacing';
import fs from 'fs';

async function main() {
    try {
        const client = new HKJCClient();
        const horseAPI = new HorseRacingAPI(client);
        
        let data = await horseAPI.getAllRaces();

        console.log(data)
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
