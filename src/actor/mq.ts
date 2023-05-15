import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface ErrorLog {
  time: Time;
  error: string;
  message: Message;
  subscriber: Principal;
}
export interface Log {
  tag: string;
  time: Time;
  level: LogLevel;
  message: string;
}
export type LogLevel = number;
export interface Message {
  topic: string;
  data: Value;
  createdAt: Time;
  productor: Principal;
}
export interface Queue {
  topic: string;
  messages: bigint;
  name: string;
  subscriber: Principal;
  lastConsumeAt: Time;
}
export type Role =
  | { RoleOwner: null }
  | { RoleAnyone: null }
  | { RoleClient: null }
  | { RoleAdmin: null };
export type Time = bigint;
export interface Topic {
  code: Topic__1;
  name: string;
}
export type Topic__1 = string;
export type Value =
  | { Int: bigint }
  | { Map: Array<[string, Value]> }
  | { Nat: bigint }
  | { List: Array<Value> }
  | { Text: string };
export interface _SERVICE {
  addAdmin: ActorMethod<[Principal], undefined>;
  addClient: ActorMethod<[Principal], undefined>;
  addQueue: ActorMethod<[Queue], boolean>;
  addTopic: ActorMethod<[Topic], boolean>;
  admins: ActorMethod<[], Array<Principal>>;
  clients: ActorMethod<[], Array<Principal>>;
  delQueue: ActorMethod<[string, Principal], boolean>;
  delTopic: ActorMethod<[string], boolean>;
  deleteAdmin: ActorMethod<[Principal], undefined>;
  deleteClient: ActorMethod<[Principal], undefined>;
  errors: ActorMethod<[], Array<ErrorLog>>;
  getAccessControlState: ActorMethod<
    [],
    {
      owners: Array<Principal>;
      admins: Array<Principal>;
      clients: Array<Principal>;
    }
  >;
  getQueues: ActorMethod<[string], Array<Queue>>;
  logs: ActorMethod<[], Array<Log>>;
  owners: ActorMethod<[], Array<Principal>>;
  publish: ActorMethod<[Message], undefined>;
  queues: ActorMethod<[], Array<Queue>>;
  roles: ActorMethod<[], Array<Role>>;
  setClient: ActorMethod<[Array<Principal>], undefined>;
  setOwner: ActorMethod<[Array<Principal>], undefined>;
  topics: ActorMethod<[], Array<Topic>>;
}
