import { Scopes } from '../src/scopes';
const fs = require('fs');

jest.mock('fs');

describe('scopes.ts', () => {
  it('should return available scopes, including "core"', () => {
    const scoper = new Scopes({"scopes": []}, ["core","data"]);
    const available = scoper.list();

    expect(available).toContain('core');
    expect(available.length).toBeGreaterThan(0);
  });

  it('should return valid scope info for "core"', () => {
    fs.readFileSync.mockReturnValueOnce('{"description": "example", "name": "core"}');

    const scoper = new Scopes({"scopes": []}, ["core","data"]);
    const info = Object.keys(scoper.info('core'));

    expect(info).toContain('description');
    expect(info).toContain('name');
  });

  it('can build managedTypes for given scopes', () => {
    fs.readdirSync.mockReturnValueOnce(['core', 'data']);
    fs.readFileSync.mockReturnValueOnce('{"scopes": ["core", "data"]}');

    const scoper = new Scopes();
    scoper.build();

    expect(fs.writeFileSync).toMatchSnapshot();
  });

  it('throws when given invalid scope', () => {
    fs.readdirSync.mockReturnValueOnce(['core', 'data']);
    fs.readFileSync.mockReturnValueOnce('{"scopes": ["core", "data", "invalid"]}');

    const scoper = new Scopes();

    expect(() => scoper.build()).toThrow();
  });

  it('can build when scopes are missing', () => {
    fs.readdirSync.mockReturnValueOnce(['core', 'data']);
    fs.readFileSync.mockReturnValueOnce('{}');

    const scoper = new Scopes();
    scoper.build();

    expect(fs.writeFileSync).toMatchSnapshot();
  });

  it('can add scope "data"', () => {
    fs.readFileSync.mockReturnValueOnce('{"name": "data"}');
    fs.writeFileSync.mockReturnValue(true);

    const scoper = new Scopes({"scopes": ["core"]}, ["core","data"]);
    scoper.build();

    scoper.add('data');

    expect(fs.writeFileSync).toMatchSnapshot();
  });

  it('can add scope "data" to empty', () => {
    fs.readFileSync.mockReturnValueOnce('{"name": "data"}');
    fs.writeFileSync.mockReturnValue(true);

    const scoper = new Scopes({"scopes": []}, ["core","data"]);
    scoper.build();

    scoper.add('data');

    expect(fs.writeFileSync).toMatchSnapshot();
  });

  it('handles adding scope "data" twice', () => {
    fs.readFileSync
      .mockReturnValueOnce('{"name": "data"}')
      .mockReturnValueOnce('{"name": "data"}')
    fs.writeFileSync.mockReturnValue(true);

    const scoper = new Scopes({"scopes": []}, ["core","data"]);
    scoper.build();

    scoper.add('data');
    scoper.add('data');

    expect(fs.writeFileSync).toMatchSnapshot();
  });

  it('can add scope "data" with dependency "core"', () => {
    fs.readFileSync
      .mockReturnValueOnce('{"name": "data", "dependencies": ["core"]}')
      .mockReturnValueOnce('{"name": "core"}')
    fs.writeFileSync.mockReturnValue(true);

    const scoper = new Scopes({"scopes": []}, ["core","data"]);
    scoper.build();

    scoper.add('data');

    expect(fs.writeFileSync).toMatchSnapshot();
  });

  it('throws when adding invalid scope', () => {
    const scoper = new Scopes({"scopes": ["core"]}, ["core","data"]);
    scoper.build();

    expect(() => scoper.add('invalid')).toThrow();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
