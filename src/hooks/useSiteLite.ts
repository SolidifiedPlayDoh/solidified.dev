import { useSyncExternalStore } from "react";

import { isSiteLite, subscribeSiteFx } from "../lib/siteFx";

export function useSiteLite(): boolean {
  return useSyncExternalStore(subscribeSiteFx, isSiteLite, () => true);
}
