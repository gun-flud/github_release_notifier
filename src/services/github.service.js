import apiClient from './api.service.js';

export function isValidRepoFormat (repoPath) {
    if (!repoPath || typeof repoPath !== 'string' ) return false;

    const schema = (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);

    return schema.test(repoPath);
}

export async function verifyRepository (path) {
    if (!isValidRepoFormat(path)) {
        const err = new Error('Invalid repository format. Use "owner/repo"');
        err.status = 400;
        throw err;
    }

        const url = `https://api.github.com/repos/${path}`;
        const data = await apiClient(url);

        return data
}

export async function getLatestRelease(path) {
    try {
        const url = `https://api.github.com/repos/${path}/releases/latest`;
        const data = await apiClient(url);
        
        return data;
    } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}