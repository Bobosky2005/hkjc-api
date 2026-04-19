import { HKJCClient } from '../src/client';
import { HorseRacingAPI } from '../src/modules/horseRacing';

async function main() {
	const client = new HKJCClient();
	const api = new HorseRacingAPI(client);

	try {
		const raceOdds = await api.getRaceOdds(2)
		console.log(raceOdds)
	} catch (error) {
		console.error('Error:', error);
	}
}

main();
