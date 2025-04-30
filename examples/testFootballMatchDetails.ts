import { HKJCClient } from '../src/client';
import { FootballAPI } from '../src/modules/football';
import { FootballOddsType } from '../src/types/football';

async function main() {
  try {
    const client = new HKJCClient();
    const footballAPI = new FootballAPI(client);
    
    // Example: Get details for a specific match
    // You can replace this with any valid match ID
    const matchId = '50047131'; // This was the example match ID from our JSON sample
    
    console.log(`Fetching details for match ID: ${matchId}...`);
    
    // Get match details with all available odds types
    const matchDetails = await footballAPI.getFootballMatchDetails(matchId);
    
    if (matchDetails) {
      console.log('\nMatch Details:');
      console.log(`ID: ${matchDetails.id}`);
      console.log(`Front End ID: ${matchDetails.frontEndId}`);
      console.log(`Date: ${matchDetails.matchDate}`);
      console.log(`Kick-off Time: ${matchDetails.kickOffTime}`);
      console.log(`Status: ${matchDetails.status}`);
      console.log(`Home Team: ${matchDetails.homeTeam.name_en} (${matchDetails.homeTeam.name_ch})`);
      console.log(`Away Team: ${matchDetails.awayTeam.name_en} (${matchDetails.awayTeam.name_ch})`);
      console.log(`Tournament: ${matchDetails.tournament.name_en} (${matchDetails.tournament.name_ch})`);
      
      // Show pool information
      if (matchDetails.poolInfo) {
        console.log('\nPool Information:');
        console.log(`Normal Pools: ${matchDetails.poolInfo.normalPools.join(', ')}`);
        console.log(`Inplay Pools: ${matchDetails.poolInfo.inplayPools.join(', ')}`);
      }
      
      // Example of accessing HAD (Home/Away/Draw) odds if available
      console.log('\nOdds Information:');
      const hadPool = matchDetails.foPools.find(pool => pool.oddsType === 'HAD');
      
      if (hadPool) {
        console.log('Home/Away/Draw (HAD) odds:');
        
        hadPool.lines.forEach(line => {
          line.combinations.forEach(combo => {
            const selection = combo.selections[0];
            console.log(`- ${selection.name_en}: ${combo.currentOdds}`);
          });
        });
      }
      
      // Get the total number of odds types available
      console.log(`\nTotal number of odds types available: ${matchDetails.foPools.length}`);
      
      // Show all available odds types
      const oddsTypes = [...new Set(matchDetails.foPools.map(pool => pool.oddsType))];
      console.log(`Available odds types: ${oddsTypes.join(', ')}`);
      
    } else {
      console.log(`No match found with ID: ${matchId}`);
    }
    
    // Example: Get match details with specific odds types
    console.log('\n\nFetching match details with specific odds types...');
    
    const specificOddsTypes: FootballOddsType[] = ['HAD', 'CRS', 'HHA'];
    const matchWithSpecificOdds = await footballAPI.getFootballMatchDetails(matchId, specificOddsTypes);
    
    if (matchWithSpecificOdds) {
      console.log(`Successfully fetched match with specific odds types: ${specificOddsTypes.join(', ')}`);
      console.log(`Number of odds pools returned: ${matchWithSpecificOdds.foPools.length}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
