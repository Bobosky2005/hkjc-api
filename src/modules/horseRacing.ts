import { HKJCClient, defaultClient } from '../client';
import { RaceMeeting, Race } from '../types/horseRacing';
import { horseQuery, horseOddsQuery, horsePoolQuery } from '../query/horseRacingQuery';

interface RaceMeetingsResponse {
    timeOffset: {
        rc: number;
    };
    activeMeetings: RaceMeeting[];
    raceMeetings: RaceMeeting[];
}

/**
 * Selects a specific meeting, e.g. { date: '2026-11-01', venueCode: 'HV' }.
 * When omitted, HKJC returns its current default meeting.
 */
interface GetRacesOptions {
    date?: string;
    venueCode?: string;
}

interface OddsResponse {
    raceMeetings: {
        pmPools: any[];
        totalInvestment?: number;
        poolInvs?: any[];
    }[];
}

export type OddsType =
    'WIN' | 'PLA' | 'QIN' | 'QPL' | 'CWA' | 'CWB' | 'CWC' | 'IWN' |
    'FCT' | 'TCE' | 'TRI' | 'FF' | 'QTT' | 'DBL' | 'TBL' | 'DT' |
    'TT' | 'SixUP';

export class HorseRacingAPI {
    private client: HKJCClient;

    constructor(client?: HKJCClient) {
        this.client = client || defaultClient;
    }

    private async getRaceMeetings(options: GetRacesOptions = {}): Promise<{
        activeMeetings: RaceMeeting[];
        raceMeetings: RaceMeeting[];
    }> {
        const response = await this.client.request<RaceMeetingsResponse>(
            horseQuery,
            options
        );

        return {
            activeMeetings: response.activeMeetings,
            raceMeetings: response.raceMeetings
        };
    }

    async getActiveMeetings(): Promise<RaceMeeting[]> {
        const { activeMeetings } = await this.getRaceMeetings();
        return activeMeetings;
    }

    async getRace(raceNumber: number = 1, options: GetRacesOptions = {}): Promise<Race | null> {
        const { raceMeetings } = await this.getRaceMeetings(options);

        const meeting = raceMeetings[0];
        if (!meeting) return null;

        const race = meeting.races.find(race => 
            Number(race.no) === raceNumber || race.no === String(raceNumber)
        );
        return race || null;
    }

    async getAllRaces(options: GetRacesOptions = {}): Promise<RaceMeeting[]> {
        const { raceMeetings } = await this.getRaceMeetings(options);
        return raceMeetings;
    }

    /**
     * Gets the detailed odds information for a specific race
     * @param raceNumber The race number to get odds for (defaults to 1)
     * @param oddsTypes Array of odds types to retrieve (defaults to WIN and PLA)
     * @param options Meeting date / venue code (defaults to HKJC's current meeting)
     * @returns An array of odds details for the specified race and odds types
     */
    async getRaceOdds(
        raceNumber: number = 1,
        oddsTypes: OddsType[] = ['WIN', 'PLA'],
        options: GetRacesOptions = {},
    ): Promise<any[]> {
        const oddsResponse = await this.client.request<OddsResponse>(
            horseOddsQuery,
            {
                ...options,
                raceNo: raceNumber,
                oddsTypes,
            }
        );

        return oddsResponse.raceMeetings[0]?.pmPools || [];
    }

    /**
     * Gets the pool investment information for a specific race
     * @param raceNumber The race number to get pool info for (defaults to 1)
     * @param oddsTypes Array of odds types to retrieve (defaults to WIN and PLA)
     * @param options Meeting date / venue code (defaults to HKJC's current meeting)
     * @returns An array of pool information for the specified race and odds types
     */
    async getRacePools(
        raceNumber: number = 1,
        oddsTypes: OddsType[] = ['WIN', 'PLA'],
        options: GetRacesOptions = {},
    ): Promise<any[]> {
        const poolResponse = await this.client.request<OddsResponse>(
            horsePoolQuery,
            {
                ...options,
                raceNo: raceNumber,
                oddsTypes,
            }
        );

        return poolResponse.raceMeetings[0]?.poolInvs || [];
    }
}