import { writable, type Writable } from "svelte/store";
import type { I_Proposal } from "./types/imported-types"

export const proposals_store: Writable<I_Proposal[]> = writable([])