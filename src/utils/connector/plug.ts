import { HttpAgent } from "@dfinity/agent";
import type { IConnector } from "./connectors";
import { Wallet } from "../../types/index";
import host from "../../constants/host";
import { mq_id } from "../../actor/id";
import { isLocked } from "../../hooks/useAuth";

export class PlugConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: Boolean;
  };
  private identity?: any;
  private principal?: string;
  private httpAgent?: HttpAgent;

  public get getIdentity() {
    return this.identity;
  }

  public get getPrincipal() {
    return this.principal;
  }

  public async getHttpAgent() {
    return this.httpAgent;
  }

  constructor(userConfig = {}) {
    this.config = {
      whitelist: [],
      host: host,
      providerUrl: "",
      dev: false,
      ...userConfig,
    };
  }

  async init() {
    return true;
  }

  async isConnected() {
    const locked = isLocked();

    if (locked) return false;

    if (window.ic.plug) {
      return await window.ic.plug.isConnected();
    }

    return false;
  }

  async connect() {
    if (await this.isConnected()) {
      this.principal = await window.ic.plug.getPrincipal();
      await window.ic.plug.createAgent({
        whitelist: [mq_id],
        host: this.config.host,
      });
      this.httpAgent = window.ic.plug.agent;
    } else {
      await window.ic.plug.requestConnect({ whitelist: [mq_id] });
      await window.ic.plug.createAgent({
        whitelist: [mq_id],
        host: this.config.host,
      });

      this.principal = await window.ic.plug.getPrincipal();
      this.httpAgent = window.ic.plug.agent;
    }

    return true;
  }

  async disconnect() {
    await window.ic.plug.disconnect();
    return true;
  }
}

export const PlugWallet = {
  connector: PlugConnector,
  id: "plug",
  type: Wallet.PLUG,
};
