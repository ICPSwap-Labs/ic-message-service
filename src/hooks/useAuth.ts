import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import GlobalContext from "../GlobalContext";
import { Wallet } from "../types/index";
import { initialConnector, getConnectorPrincipal } from "../utils/connector";

export function isLocked() {
  const locked = window.sessionStorage.getItem("locked");

  if (!locked || locked === JSON.stringify(true)) return true;
  return false;
}

export function useLockedStateManager(): [boolean, (locked: boolean) => void] {
  const [locked, setLocked] = useState(true);

  const unlock = useCallback((locked: boolean) => {
    window.sessionStorage.setItem("locked", JSON.stringify(locked));
    setLocked(locked);
  }, []);

  useEffect(() => {
    try {
      const locked = JSON.parse(
        window.sessionStorage.getItem("locked") ?? JSON.stringify("")
      );

      if (locked === false) {
        setLocked(false);
      }
    } catch (error) {}
  }, [setLocked]);

  return useMemo(() => [locked, unlock], [locked, unlock]);
}

export type AuthValue = {
  principal: string;
  wallet: Wallet;
};

export function getLocalAuth() {
  return JSON.parse(
    window.localStorage.getItem("mq-auth") ?? JSON.stringify("")
  );
}

export function setLocalAuth(auth: AuthValue | undefined) {
  if (!auth) {
    window.localStorage.removeItem("mq-auth");
    return;
  }

  window.localStorage.setItem("mq-auth", JSON.stringify(auth));
}

export function useInitialAuth() {
  const { setAuth } = useContext(GlobalContext);

  useEffect(() => {
    const _value = JSON.parse(
      window.localStorage.getItem("mq-auth") ?? JSON.stringify("")
    );

    let auth: AuthValue | undefined = undefined;

    if (!!_value) {
      auth = _value as AuthValue;
    }

    if (!!auth) {
      setAuth(auth);
    } else {
      setAuth(undefined);
    }
  }, [setAuth]);
}

export function useInitialConnector() {
  const { auth } = useContext(GlobalContext);

  const [locked] = useLockedStateManager();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (auth !== "not_initial" && auth) {
        await initialConnector(auth.wallet);
        setLoading(false);
      }

      if (auth !== "not_initial" && !auth && !!locked) {
        setLoading(false);
      }
    }

    init();
  }, [auth, locked]);

  return useMemo(() => ({ loading }), [loading]);
}

export function useConnect() {
  const { setAuth } = useContext(GlobalContext);
  const [, updateState] = useLockedStateManager();

  return useCallback(
    async (wallet: Wallet) => {
      await initialConnector(wallet);
      const principal = await getConnectorPrincipal();
      setAuth({ wallet, principal });
      updateState(false);
    },
    [updateState, setAuth]
  );
}

export function useLogout() {
  const { setAuth } = useContext(GlobalContext);
  const [, updateState] = useLockedStateManager();

  return useCallback(async () => {
    setAuth(undefined);
    updateState(true);
    await window.connector.disconnect();
  }, [setAuth, updateState]);
}
