import EventEmitter from "eventemitter3";

type AppEvents = {
  "auth:signin": { token: string };
  "auth:unauthorized": undefined;
  "auth:signout": undefined;
  "toast:show": { message: string; type: "success" | "error" | "info" };
  // Ask Log Food's floating input to take focus (e.g. "Add a recipe").
  "food-input:focus": undefined;
};

export const eventBus = new EventEmitter<AppEvents>();
