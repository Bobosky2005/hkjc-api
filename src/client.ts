import { GraphQLClient } from "graphql-request";

export class HKJCClient {
    private client: GraphQLClient;

    constructor(endpoint?: string) {
        this.client = new GraphQLClient(endpoint || "https://info.cld.hkjc.com/graphql/base/");
    }

    async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
        return this.client.request<T>(query, variables);
    }
}

// Add a singleton instance that can be imported directly
export const defaultClient = new HKJCClient();
