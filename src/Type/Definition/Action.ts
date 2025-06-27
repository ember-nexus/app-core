type ActionManifest<C = object> = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  configuration?: C;
};

interface Action<T = unknown, C = object> {
  getManifest(): ActionManifest<C>;
  supports(data: unknown): boolean;
  execute(data: unknown, configuration?: C): Promise<T>;
}

export { Action, ActionManifest };
