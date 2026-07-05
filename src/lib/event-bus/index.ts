import EventEmitter from 'eventemitter3';

type AppEvents = {
  'auth:unauthorized': undefined;
  'auth:signout': undefined;
  'toast:show': { message: string; type: 'success' | 'error' | 'info' };
};

export const eventBus = new EventEmitter<AppEvents>();