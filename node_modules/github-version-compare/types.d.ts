declare namespace GithubVersionCompare {
  interface IVersion {
    latestVersion:    string;
    publishedAt:      Date;
    readonly currentVersion:   string;
    readonly repository:       string;
    readonly latestReleaseUrl: string;
    isInitialized:    boolean;
    hasLatestVersion(): boolean;
    pull(): Promise<GithubVersionCompare.IVersion>;
  }

  class Version implements IVersion {
    constructor(repository: string, packagejson: {version: string});
    latestVersion:    string;
    publishedAt:      Date;
    readonly currentVersion:   string;
    readonly repository:       string;
    readonly latestReleaseUrl: string;
    isInitialized:    boolean;
    hasLatestVersion(): boolean;
    pull(): Promise<GithubVersionCompare.IVersion>;
  }
}

declare module 'github-version-compare' {
  export = GithubVersionCompare;
}
