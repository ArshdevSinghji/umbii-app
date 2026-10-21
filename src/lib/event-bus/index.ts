import EventEmitter from "eventemitter3";
import type { SignOutReason } from "../http-client";

type AppEvents = {
  "auth:signin": { token: string };
  // Set when the user should be told why they were signed out.
  "auth:unauthorized": { reason?: SignOutReason };
  "auth:signout": undefined;
  "toast:show": { message: string; type: "success" | "error" | "info" };
  // Ask Log Food's floating input to take focus (e.g. "Add a recipe").
  "food-input:focus": undefined;
};

export const eventBus = new EventEmitter<AppEvents>();
