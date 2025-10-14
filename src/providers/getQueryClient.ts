import { isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        //to prevent fetching immediately when useQuery
        staleTime: 60 * 1000,
      },
    },
  });
}
//to store outside of any react component
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient(); //in a server, always return a new instance of queryclient
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
