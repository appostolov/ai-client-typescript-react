export interface Config {
    [key: string]: any;
}

type Registry = Record<string, Config>;

export interface Helper {
  components: Registry;
  generateId(): string;
  register(id: string, config: Config): void;
  remove(id: string): void;
  find(props?: Record<string, any>, first?: boolean, strict?: boolean): Config[];
}

export interface Props {
  config: Config;
  key?: number;
  [key: string]: any;        
}