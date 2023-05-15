import type { Ed25519KeyIdentity } from "@dfinity/identity";

export enum ResultStatus {
  ERROR = "err",
  OK = "ok",
}

export type Result<T> = {
  readonly status: ResultStatus;
  readonly data: T | undefined;
  readonly message: string;
};

export type CallResult<T> = {
  readonly result: ApiResult<T>;
  readonly loading: boolean;
};

export type ApiResult<T> = undefined | T;

export type CallIdentity = Ed25519KeyIdentity;

export type Override<P, S> = Omit<P, keyof S> & S;

export enum Wallet {
  IC = "ic",
  PLUG = "plug",
}
