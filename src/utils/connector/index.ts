import { InternetIdentityConnector } from "./internet-identity";
import type { IConnector, IWalletConnector } from "./connectors";
import { Wallet } from "../../types/index";
import host from "../../constants/host";
import { PlugConnector } from "./plug";

type ConnectorClass = {
  new (...args: any[]): IConnector & Partial<IWalletConnector>;
};

export type ProviderOptions = {
  connector: ConnectorClass;
  id: string;
  name: string;
};

export type Provider = {
  connector: IConnector & Partial<IWalletConnector>;
  id: string;
  name: string;
};

export type ConnectConfig = {
  whitelist: Array<string>;
  host: string;
  providerUrl: string;
  dev: boolean;
};

export class Connector {
  public connector: (IConnector & Partial<IWalletConnector>) | null = null;
  public wallet: Wallet = Wallet.IC;

  public async init(wallet: Wallet) {
    await this.create(wallet);

    this.wallet = wallet;

    await this.connector?.init();

    if (!(await this.isConnected())) {
      await this.connect();
    }

    // @ts-ignore
    window.connector = this.connector;
  }

  public async create(wallet: Wallet, config?: { [key: string]: any }) {
    this.wallet = wallet;

    const _config = {
      host,
      ...(config ?? {}),
    };

    switch (wallet) {
      case Wallet.IC:
        this.connector = new InternetIdentityConnector(_config);
        break;
      case Wallet.PLUG:
        this.connector = new PlugConnector(_config);
        break;
      default:
        throw new Error("Not support this connect for now");
    }
  }

  public async connect() {
    await this.connector?.init();

    const isConnectedSuccessfully = await this.connector?.connect();

    // @ts-ignore
    window.connector = this.connector;

    return isConnectedSuccessfully;
  }

  public async isConnected() {
    return this.connector?.isConnected();
  }
}

export async function getConnectorIsConnected(): Promise<boolean> {
  return window.connector.isConnected();
}

export async function getConnectorPrincipal(): Promise<string> {
  return window.connector.getPrincipal.toString();
}

export async function initialConnector(wallet: Wallet) {
  const connector = new Connector();
  await connector.init(wallet);
}

export * from "./internet-identity";
