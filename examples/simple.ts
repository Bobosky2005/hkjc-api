import { FootballAPI } from "../src";

const footballAPI = new FootballAPI();

async function main() {
	const result = await footballAPI.getAllFootballMatches();
	console.log(`Fetched ${result.length} matches`);

	if (result.length === 0) {
		console.log('No matches returned.');
		return;
	}

	const detail = await footballAPI.getFootballMatchDetails(result[0].id);
	console.log(detail);
}

main();