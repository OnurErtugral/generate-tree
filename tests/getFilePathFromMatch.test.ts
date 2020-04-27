import getFilePathFromMatch from "../src/utils/getFilePathFromMatch";
import {
  singleQuoteMatch,
  doubleQuoteMatch,
  matchWithSpaces,
  matchWithExtension,
} from "./mockFolders/mockFilePaths";

describe("gets file path from a match", () => {
  it("if it has single quote", () => {
    const paths = Object.keys(singleQuoteMatch);

    paths.forEach((path) => {
      expect(getFilePathFromMatch(path)).toBe(singleQuoteMatch[path]);
    });
  });

  it("if it has double quote", () => {
    const paths = Object.keys(doubleQuoteMatch);

    paths.forEach((path) => {
      expect(getFilePathFromMatch(path)).toBe(doubleQuoteMatch[path]);
    });
  });

  it("if it has extra spaces", () => {
    const paths = Object.keys(matchWithSpaces);

    paths.forEach((path) => {
      expect(getFilePathFromMatch(path)).toBe(matchWithSpaces[path]);
    });
  });

  it("if it has extension", () => {
    const paths = Object.keys(matchWithExtension);

    paths.forEach((path) => {
      expect(getFilePathFromMatch(path)).toBe(matchWithExtension[path]);
    });
  });
});
