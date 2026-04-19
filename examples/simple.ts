import { FootballAPI } from "../src";

let footballAPI = new FootballAPI();


async function main() {
	let result = await footballAPI.getAllFootballMatches();

	let detail = await footballAPI.getFootballMatchDetails(result[0].id);

	console.log(detail);
}

main();