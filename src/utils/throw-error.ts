import { debugAlert_FORCE_DO_NOT_USE } from "./debug";

export class ErrorWithToast extends Error {
  constructor(
    public devMsg: string,
    public userMsg: string
  ) {
    super(devMsg);
    this.name = "ErrorWithToast";
  }
}

export const throwError = (
  devMsg: string,
  userMsg = "Something went wrong"
): never => {
  debugAlert_FORCE_DO_NOT_USE(devMsg);
  throw new ErrorWithToast(devMsg, userMsg);
};
