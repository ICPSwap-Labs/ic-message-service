import { ActorSubclass } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

export interface IConnector {
  init: () => Promise<boolean>;
  isConnected: () => Promise<boolean>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  getPrincipal: string | undefined;
}

export interface RequestTransferParams {
  amount: number;
  from?: string;
  to: string;
  memo?: bigint;
}

export interface IWalletConnector {
  // TODO: Result type?
  address: () => {
    principal?: string;
    accountId?: string;
  };
  requestTransfer: ({
    amount,
    from,
    to,
    memo,
  }: RequestTransferParams) => Promise<any>;
  queryBalance: () => Promise<
    | Array<{
        amount: number;
        canisterId: string;
        decimals: number;
        image?: string;
        name: string;
        symbol: string;
      }>
    | undefined
  >;
  signMessage?: (any) => Promise<any>;
  // getManagementCanister: (any) => Promise<any>
  // callClientRPC: (any) => Promise<any>
  // requestBurnXTC: (any) => Promise<any>
  // batchTransactions: (any) => Promise<any>
}

// type ProviderOptions = {
//   connector: IConnector,
// }

export interface WalletAccount {
  name: string;
  address: string;
}
