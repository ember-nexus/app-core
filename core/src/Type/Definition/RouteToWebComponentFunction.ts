type RouteToWebComponentFunction = (
  route: string,
  wildcards: string[],
  parameters: URLSearchParams | null,
) => Promise<string>;

export { RouteToWebComponentFunction };
