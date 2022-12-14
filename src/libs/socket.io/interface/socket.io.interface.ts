interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  joinAuction: (payload: PayLoadData) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface PayLoadData {
  auctionId: string;
}

export type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, PayLoadData };
