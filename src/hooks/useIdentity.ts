import { Ed25519KeyIdentity } from "@dfinity/identity";
import { CallIdentity } from "../types/index";
import { useCallback, useEffect, useMemo, useState } from "react";

export const keys = [
  "again wisdom swap oven check gre",
  "trumpet brick wet clutch bag mes",
];

export function useKeyManage(): [number, (key: number) => void] {
  const [key, setKey] = useState(0);

  const updateKey = useCallback((key: number) => {
    window.localStorage.setItem("seedKey", String(key));
    setKey(key);
  }, []);

  useEffect(() => {
    const key = window.localStorage.getItem("seedKey");
    if (key) {
      setKey(Number(key));
    }
  }, []);

  return [key, updateKey];
}

export function getKey() {
  const key = window.localStorage.getItem("seedKey");
  return key ? Number(key) : 0;
}

function getSeed(key: string) {
  const enc = new TextEncoder();
  const seed = enc.encode(key);
  return seed;
}

export async function getIdentity(): Promise<CallIdentity> {
  const key = keys[getKey()];
  return await Ed25519KeyIdentity.generate(getSeed(key));
}

export function useIdentity() {
  const [identity, setIdentity] = useState<CallIdentity | undefined>(undefined);
  const [key] = useKeyManage();

  useEffect(() => {
    const call = async () => {
      const _key = keys[key];
      const identity = await Ed25519KeyIdentity.generate(getSeed(_key));
      setIdentity(identity);
    };

    call();
  }, [key]);

  return useMemo(() => identity, [identity]);
}
