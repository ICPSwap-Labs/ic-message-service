/// <reference types="react-scripts" />

interface Window {
  ic: {
    plug: {
      createAgent: ({
        whitelist,
        host,
      }: {
        whitelist: string[];
        host: string;
      }) => Promise<boolean>;
      agent: HttpAgent;
      requestConnect: ({ whitelist }: { whitelist?: string[] }) => Promise<any>;
      fetchRootKey: () => Promise<void>;
      createActor: <T>({
        canisterId,
        interfaceFactory,
      }: {
        canisterId: string;
        interfaceFactory: IDL.interfaceFactory;
      }) => Promise<ActorSubclass<T>>;
      isConnected: () => Promise<boolean>;
      disconnect: () => Promise<void>;
      getPrincipal: () => Promise<string>;
    };
  };
  connector: {
    getPrincipal: string;
    identity: Identity;
    httpAgent: HttpAgent;
    isConnected: () => Promise<boolean>;
    createActor: <T>(
      canisterId: string,
      interfaceFactory: IDL.interfaceFactory
    ) => Promise<ActorSubclass<T>>;
    getHttpAgent: () => Promise<HttpAgent>;
    disconnect: () => Promise<void>;
  };
}
