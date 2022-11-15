import generateEnvironment from './index';

describe('generateEnvironment', () => {
  const env = process.env;

  const mockProcess = <K extends string>(vars: readonly K[]) => {
    return vars.reduce((record, k, i) => {
      process.env[k] = `${k}_${i}`;
      return {
        ...record,
        [k]: `${k}_${i}`,
      };
    }, {} as Record<K, string>);
  };

  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks();
    process.env = { ...env };
  })

  afterEach(() => {
    process.env = env;
  })

  it('should return required environment variables', () => {
    const requiredEnv = ['HELLO', 'WORLD'] as const;

    const values = mockProcess(requiredEnv);

    const result = generateEnvironment({ required: requiredEnv });

    expect(result.errors).toBeNull();
    expect(result.environment!.HELLO).toEqual(values.HELLO);
    expect(result.environment!.WORLD).toEqual(values.WORLD);
  });

  it('should return single missing environment variable', () => {
    const requiredEnv = ['HELLO', 'WORLD'] as const;

    process.env.HELLO = 'test1';

    const result = generateEnvironment({ required: requiredEnv });

    expect(result.errors).toEqual(['WORLD']);
    expect(result.environment).toBeNull();
  });

  it('should return all missing environment variables', () => {
    const requiredEnv = ['HELLO', 'WORLD'] as const;

    const result = generateEnvironment({ required: requiredEnv });

    expect(result.errors).toEqual(requiredEnv);
    expect(result.environment).toBeNull();
  });

  it('should return optional environment variables', () => {
    const optionalEnv = ['HELLO', 'WORLD'] as const;

    const values = mockProcess(optionalEnv);

    const result = generateEnvironment({ optional: optionalEnv });

    expect(result.errors).toBeNull();
    expect(result.environment!.HELLO).toEqual(values.HELLO);
    expect(result.environment!.WORLD).toEqual(values.WORLD);
  });

  it('should return partial optional environment variables', () => {
    const optionalEnv = ['HELLO', 'WORLD'] as const;

    process.env.HELLO = 'test1';

    const result = generateEnvironment({ optional: optionalEnv });

    expect(result.errors).toBeNull();
    expect(result.environment!.HELLO).toEqual('test1');
    expect(result.environment!.WORLD).toBeNull();
  });

  it('should return optional and required values', () => {
    const requiredEnv = ['HELLO', 'WORLD'] as const;
    const optionaEnv = ['FOO', 'BAR'] as const;

    const values = mockProcess(requiredEnv);
    process.env.FOO = 'FOO1';

    const result = generateEnvironment({ required: requiredEnv, optional: optionaEnv });

    expect(result.errors).toBeNull();
    expect(result.environment?.HELLO).toEqual(values.HELLO);
    expect(result.environment?.WORLD).toEqual(values.WORLD);
    expect(result.environment?.FOO).toEqual('FOO1');
    expect(result.environment?.BAR).toBeNull();
  });
});
