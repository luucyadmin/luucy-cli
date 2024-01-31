import { Constants } from '../src/constants';

describe('constants.ts', () => {
  it('distFile returns dist.lps', () => {
    expect(Constants.distFile).toEqual('dist.lps');
  });

  it('packageFile returns package.json', () => {
    expect(Constants.packageFile).toEqual('package.json');
  });

  it('assetDirectory returns assets', () => {
    expect(Constants.assetsDirectory).toEqual('assets');
  });

  it('iconFile returns assets/icon.svg', () => {
    expect(Constants.iconFile).toEqual('assets/icon.svg');
  });

  it('bundlesDirectory returns bundles/', () => {
    expect(Constants.bundlesDirectory).toEqual('bundles/');
  });

  it.each([
    ['MyApp', 'myapp'],
    ['MyApp ', 'myapp'],
    [' MyApp ', 'myapp'],
    ['$MyApp', '-myapp'],
    ['My#App', 'my-app'],
    ['My App', 'my-app'],
    ['My---App234', 'my-app234']
  ])('bundleName("%s", "1.0.0") returns %s-1.0.0.lpb', (input, expectedOutput) => {
    const normalizedName = Constants.bundleName(input, '1.0.0');
    expect(normalizedName).toEqual(`${expectedOutput}-1.0.0.lpb`);
  });

  it('typesPackage returns luucy-types', () => {
    expect(Constants.typesPackage).toEqual('luucy-types');
  });

  it('typesRoot returns ["node_modules", "luucy-types"]', () => {
    expect(Constants.typesRoot).toEqual(['node_modules', 'luucy-types']);
  });

  it('typesRepository("test") returns luucyadmin/luucy-types.git#next/test', () => {
    const repo = Constants.typesRepository('test');
    expect(repo).toEqual('luucyadmin/luucy-types.git#next/test');
  });

  it('scopes returns "node_modules/luucy-types/scopes"', () => {
    expect(Constants.scopes).toEqual('node_modules/luucy-types/scopes');
  });

  it('managed returns ".luucy"', () => {
    expect(Constants.managed).toEqual('.luucy');
  });

  it('managedTypes returns ".luucy/types.d.ts"', () => {
    expect(Constants.managedTypes).toEqual('.luucy/types.d.ts');
  });

  it.each([
    ['test', 'http://localhost:4200'],
    ['staging', 'https://staging.luucy.ch'],
    ['productive', 'https://app.luucy.ch']
  ])('environments.%s returns %s', (environmentName, environmentUrl) => {
    expect(Constants.environments[environmentName]).toEqual(environmentUrl);
  });
});
