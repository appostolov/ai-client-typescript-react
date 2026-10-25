export interface Config {
    [key: string]: any;
}

type Registry = Record<string, Config>;

export interface Helper {
  components: Registry;
  generateId(): string;
  register(config: Config): void;
  remove(config: Config): void;
  find(props?: Record<string, any>, first?: boolean, strict?: boolean): Config[];
}

export interface Props {
  config: Config;
  key?: number;
  [key: string]: any;        
}

export interface State {
  value: any;
  setter: Function;
  effects: Function[]     
}

export interface Effect {
  state: State;
  effect: Function;
}

export interface Event {
  type: string;
  node: EventTarget;
  callback: Function;
  self?: boolean;
  selector?: string;
  useCapture?: boolean;
}

export interface Request {
  url: string;
  method?: string,
  data: any;
  success( result: any, xhttp: XMLHttpRequest ): void;
  error( result: any, xhttp: XMLHttpRequest ): void;
}