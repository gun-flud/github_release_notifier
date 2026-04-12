
export function isValidRepoFormat(repoPath) {
    const result = false;
    if (!repoPath || typeof repoPath !== 'string' ) return result;
    const schema = (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
    result = schema.test(repoPath);

    return result;
    // must return 400;
}

verifyRepository() 
getLatestRelease()