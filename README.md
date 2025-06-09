# HKJC API

A Node.js package for communicating with the Hong Kong Jockey Club (HKJC) GraphQL API.

## Features

- Horse Racing API
  - Get active race meetings
  - Get detailed race information and runners
  - Fetch various odds types (WIN, PLA, QIN, QPL, etc.)
  - Get pool investment data
  
- Football API
  - Get all football matches with filtering options
  - Get detailed information for specific matches
  - Access odds for multiple bet types (HAD, HHA, CRS, etc.)

---

## Installation

```bash
npm install hkjc-api
```

---

## Usage

### Basic Setup

You can now use the HKJC API in two ways:

#### Simplified Setup (Recommended)

```typescript
import { HorseRacingAPI, FootballAPI } from 'hkjc-api';

// Initialize APIs directly - client is created automatically
const horseRacingAPI = new HorseRacingAPI();
const footballAPI = new FootballAPI();
```

#### Advanced Setup (Custom Client)

```typescript
import { HKJCClient, HorseRacingAPI, FootballAPI } from 'hkjc-api';

// Create a custom client if needed
const client = new HKJCClient();

// Initialize APIs with the custom client
const horseRacingAPI = new HorseRacingAPI(client);
const footballAPI = new FootballAPI(client);
```

---

### Horse Racing API

#### Get Race Meetings

```typescript
// Get only active meetings
const activeMeetings = await horseRacingAPI.getActiveMeetings();

// Get all race meetings (includes race details)
const raceMeetings = await horseRacingAPI.getAllRaces();
```

#### Get Race Information

```typescript
// Get all races
const races = await horseRacingAPI.getAllRaces();

// Get a specific race (default is race 1)
const race = await horseRacingAPI.getRace(3); // Get race #3
```

#### Get Race Runners

```typescript
// Note: Runner information is included in the race data from getAllRaces() or getRace()
// Access runners through the race object's runners property
const race = await horseRacingAPI.getRace(1);
const runners = race?.runners || [];
```

#### Get Race Odds

```typescript
// Get odds for a specific race and odds types
const oddsResult = await horseRacingAPI.getRaceOdds(
  1,                      // Race number (defaults to 1)
  ['WIN', 'PLA', 'QIN']   // Odds types (defaults to ['WIN', 'PLA'])
);

// Get pool investment data
const poolsResult = await horseRacingAPI.getRacePools(
  1,                      // Race number (defaults to 1)
  ['WIN', 'PLA']          // Odds types (defaults to ['WIN', 'PLA'])
);
```

---

### Football API

#### Get All Football Matches

```typescript
// Get all football matches
const allMatches = await footballAPI.getAllFootballMatches();

// Get matches with filters
const filteredMatches = await footballAPI.getAllFootballMatches({
  startDate: '2025-04-30',
  endDate: '2025-05-07',
  tournIds: ['50046423'],          // Tournament IDs
  oddsTypes: ['HAD', 'CRS', 'HHA'], // Odds types
  featuredMatchesOnly: true        // Only featured matches
});
```

#### Get Match Details

```typescript
// Get details for a specific match
const matchDetails = await footballAPI.getFootballMatchDetails('50047131');

// Get details with specific odds types only
const matchWithSpecificOdds = await footballAPI.getFootballMatchDetails(
  '50047131',
  ['HAD', 'HHA', 'CRS']
);
```

---

## Available Odds Types

### Horse Racing

The following odds types are supported for horse racing:

- `WIN` - Win (獨贏)
- `PLA` - Place (位置)
- `QIN` - Quinella (連贏)
- `QPL` - Quinella Place (位置Q)
- `CWA` - Composite Win A (組合獨贏A)
- `CWB` - Composite Win B (組合獨贏B)
- `CWC` - Composite Win C (組合獨贏C)
- `IWN` - Investment Win (投資獨贏)
- `FCT` - Forecast (二重彩)
- `TCE` - Tierce (三重彩)
- `TRI` - Trio (單T)
- `FF` - First Four (四連環)
- `QTT` - Quartet (四重彩)
- `DBL` - Double (孖寶)
- `TBL` - Treble (三寶)
- `DT` - Double Trio (孖T)
- `TT` - Triple Trio (三T)
- `SixUP` - Six Up (六環彩)

### Football

The following odds types are supported for football:

- `HAD` - Home/Away/Draw (主客和)
- `EHA` - Early Home/Away (早場主客和)
- `SGA` - Special Group A (特別組A)
- `CHP` - Championship (冠軍)
- `TQL` - To Qualify (晉級)
- `FHA` - First Half Home/Away/Draw (半場主客和)
- `HHA` - Handicap Home/Away (讓球主客)
- `HDC` - Handicap (讓球)
- `EDC` - Early Handicap (早場讓球)
- `HIL` - Hi/Lo (Over/Under) (大細)
- `EHL` - Early Hi/Lo (早場大細)
- `FHL` - First Half Hi/Lo (半場大細)
- `CHL` - Corner Hi/Lo (角球大細)
- `ECH` - Early Corner Hi/Lo (早場角球大細)
- `FCH` - First Half Corner Hi/Lo (半場角球大細)
- `CRS` - Correct Score (波膽)
- `ECS` - Early Correct Score (早場波膽)
- `FCS` - First Half Correct Score (半場波膽)
- `FTS` - First Team to Score (首隊入球)
- `TTG` - Total Goals (總入球)
- `ETG` - Early Total Goals (早場總入球)
- `OOE` - Odd/Even (單雙)
- `FGS` - First Goalscorer (首名入球)
- `HFT` - Halftime/Fulltime (半全場)
- `MSP` - Multi-Scoring (多項入球)
- `NTS` - Anytime Goalscorer (入球球員)
- `ENT` - Early Anytime Goalscorer (早場入球球員)
- `FHH` - First Half Handicap (半場讓球)
- `FHC` - First Half Corner (半場角球)
- `CHD` - Corner Handicap (角球讓球)
- `ECD` - Early Corner Handicap (早場角球讓球)
- `EHH` - Early Handicap Home/Away (早場讓球主客)
- `AGS` - Anytime Goalscorer (全場任何時間入球)
- `LGS` - Last Goalscorer (最後入球)

---

## Examples

### Horse Racing Example

```typescript
// Simplified usage - no need to create a client instance
const { HorseRacingAPI } = require('hkjc-api');
const horseAPI = new HorseRacingAPI();

// Get active meetings
const activeMeetings = await horseAPI.getActiveMeetings();
console.log(`Found ${activeMeetings.length} active meetings`);

// Get today's race information
const races = await horseAPI.getAllRaces();
console.log(`Found ${races[0]?.races.length || 0} races today`);

// Get WIN and PLA odds for race #1
const raceOdds = await horseAPI.getRaceOdds(1, ['WIN', 'PLA']);
console.log(`WIN/PLA odds for race #1:`, raceOdds);
```

### Football Example

```typescript
// Simplified usage - no need to create a client instance
const { FootballAPI } = require('hkjc-api');
const footballAPI = new FootballAPI();

// Get all matches
const matches = await footballAPI.getAllFootballMatches();
console.log(`Found ${matches.length} football matches`);

// Get details for the first match
if (matches.length > 0) {
  const matchId = matches[0].id;
  const matchDetails = await footballAPI.getFootballMatchDetails(matchId);
  
  console.log(`Match: ${matchDetails.homeTeam.name_en} vs ${matchDetails.awayTeam.name_en}`);
  console.log(`Date: ${matchDetails.matchDate}`);
  console.log(`Kick-off: ${matchDetails.kickOffTime}`);
}
```

## Error Handling

Both APIs include proper error handling. Methods will return `null` or empty arrays when data is not found, and will throw exceptions for API errors.

```typescript
try {
  const match = await footballAPI.getFootballMatchDetails('invalid-id');
  if (match === null) {
    console.log('Match not found');
  }
} catch (error) {
  console.error('API error:', error);
}
```

## License

MIT
