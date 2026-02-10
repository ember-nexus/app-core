interface Step {
  type: string;
  query?: null | string | Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export { Step };
