import { HorseRacingAPI, FootballAPI } from '../src';

// Create examples for the API methods
async function example() {
  console.log('HKJC API Example');
  console.log('================\n');

  // Horse Racing Example
  const horseRacingAPI = new HorseRacingAPI();
  
  try {
    console.log('🏇 HORSE RACING API');
    console.log('-----------------');
    
    // Get race information
    const race = await horseRacingAPI.getRace(1);
    console.log(`Race #1: ${race?.raceName_en} (${race?.postTime})`);
    console.log(`Distance: ${race?.distance}m | Class: ${race?.raceClass_en}`);
    console.log(`Track: ${race?.raceTrack?.description_en}`);
    console.log(`Number of runners: ${race?.runners?.length || 0}`);
    
    // Get a few runners for demonstration
    if (race?.runners && race.runners.length > 0) {
      console.log('\nTop 3 Runners:');
      race.runners.slice(0, 3).forEach(runner => {
        console.log(`  ${runner.no}. ${runner.name_en} (Jockey: ${runner.jockey.name_en}, Trainer: ${runner.trainer.name_en})`);
        console.log(`     Weight: ${runner.handicapWeight}, Draw: ${runner.barrierDrawNumber}, Last 6: ${runner.last6run}`);
      });
    }
    
    // Get odds for the race
    const odds = await horseRacingAPI.getRaceOdds(1, ['WIN', 'PLA']);
    if (odds && odds.length > 0) {
      console.log('\nOdds available: Yes');
    } else {
      console.log('\nOdds available: No');
    }
  } catch (error) {
    console.error('Error in Horse Racing example:', error);
  }

  // Football Example
  const footballAPI = new FootballAPI();
  
  try {
    console.log('\n\n⚽ FOOTBALL API');
    console.log('--------------');
    
    // Get all football matches
    const matches = await footballAPI.getAllFootballMatches();
    console.log(`Number of upcoming matches: ${matches.length}`);
    
    if (matches.length > 0) {
      // Display a few matches
      console.log('\nUpcoming Matches:');
      matches.slice(0, 3).forEach((match, index) => {
        console.log(`  Match ${index + 1}: ${match.homeTeam?.name_en} vs ${match.awayTeam?.name_en}`);
        console.log(`     Tournament: ${match.tournament?.name_en}`);
        console.log(`     Kickoff: ${match.kickOffTime}`);
      });
      
      // Get detailed info for the first match
      if (matches[0]?.id) {
        const matchDetails = await footballAPI.getFootballMatchDetails(matches[0].id);
        console.log('\nMatch Details Available:', matchDetails ? 'Yes' : 'No');
      }
    }
  } catch (error) {
    console.error('Error in Football example:', error);
  }
}

// Run the example
example().catch(console.error);
