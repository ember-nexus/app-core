type RouteGuardFunction = (route: string, wildcards: string[], parameters: URLSearchParams | null) => Promise<boolean>;

export { RouteGuardFunction };
