import * as fs from 'fs';
import { HKJCClient } from '../src/client';
import { FootballAPI } from '../src/modules/football';


async function main() {
    try {
        const client = new HKJCClient();
        const footballAPI = new FootballAPI(client);

        const matches = await footballAPI.getAllFootballMatches();

        fs.writeFileSync('matches.json', JSON.stringify(matches, null, 2));
        console.log(`Fetched ${matches.length} matches`);

        if (matches.length === 0) {
            console.log('No matches returned — nothing to fetch details for.');
            return;
        }

        const id = matches[0].id;
        const match = await footballAPI.getFootballMatchDetails(id);
        fs.writeFileSync('matchDetail.json', JSON.stringify(match, null, 2));
        console.log(`Wrote details for match ${id}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
