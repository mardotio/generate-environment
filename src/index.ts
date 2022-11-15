type EnvVarKeys = readonly string[] | undefined;

type RequiredRecord<T> = T extends NonNullable<EnvVarKeys> ? Record<T[number], string> : {};
type OptionalRecord<T> = T extends NonNullable<EnvVarKeys> ? Record<T[number], string | null> : {};

type GenerateEnvironment<
  RequiredEnv extends EnvVarKeys,
  OptionalEnv extends EnvVarKeys,
  > = { environment: RequiredRecord<RequiredEnv> & OptionalRecord<OptionalEnv>; errors: null }
    | { environment: null; errors: string[] };

export interface GenerateEnvironmentOptions<Required extends EnvVarKeys, Optional extends EnvVarKeys> {
  required?: Required;
  optional?: Optional;
}

const getEnvVars = <Fail extends boolean>(vars: NonNullable<EnvVarKeys>, fail: Fail): Fail extends true ? Record<string, string> | string[] : Record<string, string | null> | string[] => {
  const result = vars.reduce((env, envVar) => {
    const value = process.env[envVar];
    if (!value) {
      return {
        record: {
          ...env.record,
          [envVar]: null,
        },
        missing: [...env.missing, envVar],
      }
    }
    return {
      ...env,
      record: {
        ...env.record,
        [envVar]: value,
      },
    };
  }, { record: {} as Fail extends true ? Record<string, string> : Record<string, string | null>, missing: [] as string[] });

  if (fail && result.missing.length > 0) {
    return result.missing;
  }

  return result.record;
};

export const generateEnvironment = <
  RequiredEnv extends EnvVarKeys = undefined,
  OptionalEnv extends EnvVarKeys = undefined,
  >({ required, optional }: GenerateEnvironmentOptions<RequiredEnv, OptionalEnv>
): GenerateEnvironment<RequiredEnv, OptionalEnv> => {
  if (!required && !optional) {
    return {} as GenerateEnvironment<RequiredEnv, OptionalEnv>;
  }

  const req = getEnvVars(required || [], true);
  const opt = getEnvVars(optional || [], false);

  if (Array.isArray(req) || Array.isArray(opt)) {
    return {
      environment: null,
      errors: Array.isArray(req) ? req : [],
    };
  }

  return {
    environment: { ...req, ...opt },
    errors: null,
  } as GenerateEnvironment<RequiredEnv, OptionalEnv>;
};

export default generateEnvironment;
