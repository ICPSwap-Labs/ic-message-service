import { useCallback } from "react";
import { mq } from "../actor/index";
import { useCallsData } from "./useCallsData";
import { Topic, Queue } from "../actor/mq";
import { Principal } from "@dfinity/principal";

export function useTopics(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await (await mq()).topics();
    }, []),
    true,
    reload
  );
}

export async function createTopic(values: Topic) {
  return await (
    await mq()
  ).addTopic({
    name: values.name,
    code: values.code,
  });
}

export async function deleteTopic(code: string) {
  return await (await mq()).delTopic(code);
}

export function useQueues(topic: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await (await mq()).getQueues(topic!);
    }, [topic]),
    !!topic,
    reload
  );
}

export async function createQueue(queue: Queue) {
  return await (await mq()).addQueue(queue);
}

export async function deleteQueue(topic: string, subscriber: Principal) {
  return await (await mq()).delQueue(topic, subscriber);
}

export function useProducers(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await await (await mq()).clients();
    }, []),
    true,
    reload
  );
}

export async function addProducer(producer: Principal) {
  return await (await mq()).addClient(producer);
}

export async function deleteProducer(producer: Principal) {
  return await (await mq()).deleteClient(producer);
}

export function useAdmins(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await await (await mq()).admins();
    }, []),
    true,
    reload
  );
}

export async function addAdmin(admin: Principal) {
  return await (await mq()).addAdmin(admin);
}

export async function deleteAdmin(admin: Principal) {
  return await (await mq()).deleteAdmin(admin);
}

export function useErrors() {
  return useCallsData(
    useCallback(async () => {
      return await await (await mq()).errors();
    }, [])
  );
}

export function useRoles() {
  return useCallsData(
    useCallback(async () => {
      return await await (await mq()).roles();
    }, [])
  );
}
