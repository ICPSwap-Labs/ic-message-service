import { createBaseActor } from "./BaseActor";
import { HttpAgent, ActorSubclass } from "@dfinity/agent";
import { CallIdentity } from "../types/index";
import { IDL } from "@dfinity/candid";
import host, { isIC } from "../constants/host";
import { getLocalAuth } from "../hooks/useAuth";
import { mq_id } from "./id";

export type ActorConstructor = {
  canisterId: string;
  host?: string;
  idlFactory: IDL.InterfaceFactory;
  identity?: CallIdentity;
  agent?: HttpAgent;
};

export type ActorError = {
  canisterId: string;
  message: string;
  method: string;
};
export type ActorErrorCallback = (error: ActorError) => void;

export class Actor {
  private agent: null | HttpAgent = null;
  private host: string = host;
  private errorCallbacks: ActorErrorCallback[] = [];

  public async create<T>({
    canisterId,
    host,
    idlFactory,
    identity,
    agent,
  }: ActorConstructor): Promise<ActorSubclass<T>> {
    const _host = host ?? this.host;

    let _agent = this.AnonymousAgent(host);
    let isRejected = false;

    // catch plug type wallet reject error
    try {
      _agent = agent
        ? agent
        : !identity
        ? this.AnonymousAgent(host)
        : this.agent
        ? this.agent
        : await this.createAgent(_host, identity);
    } catch (err) {
      isRejected = true;
      console.error(err);
    }

    const serviceClass = idlFactory({ IDL: IDL });

    let actor: ActorSubclass<T> | null = null;

    actor = await createBaseActor<T>({
      canisterId: canisterId,
      idlFactory,
      agent: _agent,
      fetchRootKey: !isIC,
    });

    const _actor: any = {};

    serviceClass._fields.forEach((ele) => {
      const key = ele[0];

      _actor[key] = async (...args: any) => {
        if (isRejected) return { err: "The agent creation was rejected" };

        try {
          if (!actor) return { err: "no actor" };
          // @ts-ignore
          const result = actor[key](...args) as Promise<any>;
          return await result;
        } catch (error) {
          const _error = String(error);

          let message = "";
          if (_error.includes("Reject text:")) {
            const _message =
              _error.split(`Reject text: `)[1]?.split(" at") ?? "";
            message = !!_message ? _message[0]?.trim() : _error;
          } else {
            const _message = _error.includes(`"Message"`)
              ? _error.split(`"Message": `)[1]?.split('"')
              : "";
            message =
              _error.includes(`"Message"`) && !!_message ? _message[1] : _error;
          }

          console.log("Error =====================>");
          console.log("canister: ", canisterId);
          console.log("method: ", key);
          console.log("rejected: ", message);
          console.log("Error =====================>");

          this.errorCallbacks.forEach((call) => {
            call({ canisterId: canisterId ?? "", method: key, message });
          });

          return { err: message };
        }
      };
    });

    return _actor as ActorSubclass<T>;
  }

  public AnonymousAgent(host?: string) {
    return new HttpAgent({
      host: host ?? this.host,
    });
  }

  public async createAgent(
    host: string,
    identity?: CallIdentity
  ): Promise<HttpAgent> {
    if (!!identity) {
      const auth = getLocalAuth() as { wallet: string };

      if (auth.wallet === "plug") {
        await window.ic.plug.createAgent({
          whitelist: [mq_id],
          host: host ?? this.host,
        });
        return window.ic.plug.agent;
      }

      return await window.connector.getHttpAgent();
    }

    return new HttpAgent({
      host: host ?? this.host,
    });
  }

  public setAgent(agent: HttpAgent | null) {
    this.agent = agent;
  }

  public setHost(host: string) {
    this.host = host;
  }

  public onError(callback: ActorErrorCallback) {
    this.errorCallbacks.push(callback);
  }
}

export const actor = new Actor();
