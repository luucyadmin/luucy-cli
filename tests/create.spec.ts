import { Creator } from '../src/create';
import { Scopes } from '../src/scopes';
const fs = require('fs');

jest.mock('fs')
jest.mock('process')

describe('creator.ts', () => {
  const scopes = new Scopes({ scopes: ["core", "data"]}, ["core", "data"], "MyApp")

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getIcon("333333") returns a valid svg', () => {
    const creator = new Creator("", "", scopes, "333333");
    expect(creator.getIcon()).toMatchSnapshot()
  });

  it('getIcon() returns a random colored svg', () => {
    const creator = new Creator("", "", scopes);
    expect(typeof creator.getIcon()).toBe("string")
  });

  it('create() writes files and asset directory', () => {
    fs.existsSync.mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);
    
    const creator = new Creator("MyApp", "LUUCY AG", scopes, "333333");
    creator.create();
    
    expect(fs.mkdirSync).toHaveBeenNthCalledWith(1, 'MyApp');
    expect(fs.mkdirSync).toHaveBeenNthCalledWith(2, 'MyApp/assets');
    expect(fs.mkdirSync).toHaveBeenNthCalledWith(3, 'MyApp/.luucy');
    expect(fs.writeFileSync).toMatchSnapshot();
  });
});
