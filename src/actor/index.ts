import { _SERVICE } from "./mq";
import { idlFactory } from "./mq.did";
import { actor } from "./actor";
import { getIdentity } from "../hooks/useIdentity";
import { mq_id } from "./id";
import host from "../constants/host";

export const mq = async () => {
  const identity = await getIdentity();
  return actor.create<_SERVICE>({
    canisterId: mq_id,
    idlFactory,
    identity,
    host,
  });
};
