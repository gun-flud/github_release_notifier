import { test, describe, mock, beforeEach } from 'node:test';
import assert from 'node:assert';
// Notice: We removed GitHubAPIError from this import list!
import { 
    isValidRepoFormat, 
    verifyRepository, 
    getLatestRelease 
} from '../src/services/githubService.js';

describe('GitHub Service', () => {
    
    describe('isValidRepoFormat', () => {
        test('returns true for valid formats', () => {
            assert.strictEqual(isValidRepoFormat('facebook/react'), true);
            assert.strictEqual(isValidRepoFormat('golang/go'), true);
            assert.strictEqual(isValidRepoFormat('user-name/repo_name.1'), true);
        });

        test('returns false for invalid formats', () => {
            assert.strictEqual(isValidRepoFormat('react'), false);
            assert.strictEqual(isValidRepoFormat('facebook/react/extra'), false);
            assert.strictEqual(isValidRepoFormat('https://github.com/facebook/react'), false);
            assert.strictEqual(isValidRepoFormat(''), false);
        });
    });

    describe('API Fetching', () => {
        let fetchMock;

        beforeEach(() => {
            // Reset the global fetch mock before each test
            if (fetchMock) fetchMock.mock.restore();
        });

        test('verifyRepository returns data on success', async () => {
            fetchMock = mock.method(global, 'fetch', async () => ({
                ok: true,
                status: 200,
                json: async () => ({ id: 123, full_name: 'facebook/react', name: 'react', private: false })
            }));

            const repo = await verifyRepository('facebook/react');
            assert.strictEqual(repo.full_name, 'facebook/react');
            assert.strictEqual(repo.id, 123);
        });

        test('verifyRepository throws 404 when not found', async () => {
            fetchMock = mock.method(global, 'fetch', async () => ({
                ok: false,
                status: 404
            }));

            await assert.rejects(
                () => verifyRepository('nobody/nothing'),
                // We now check for a standard Error and the .status property you created
                (err) => err instanceof Error && err.status === 404
            );
        });

        test('verifyRepository throws 429 on rate limit (403)', async () => {
            fetchMock = mock.method(global, 'fetch', async () => ({
                ok: false,
                status: 403,
                headers: new Headers({ 'retry-after': '60' })
            }));

            await assert.rejects(
                () => verifyRepository('facebook/react'),
                // We now check for a standard Error and the .status property you created
                (err) => err instanceof Error && err.status === 429
            );
        });

        test('getLatestRelease returns release data', async () => {
            fetchMock = mock.method(global, 'fetch', async () => ({
                ok: true,
                status: 200,
                json: async () => ({ tag_name: 'v18.0.0', published_at: '2024-01-01', html_url: 'url', name: 'v18 Release' })
            }));

            const release = await getLatestRelease('facebook/react');
            assert.strictEqual(release.tag_name, 'v18.0.0');
        });

        test('getLatestRelease returns null if no releases exist (404)', async () => {
            fetchMock = mock.method(global, 'fetch', async () => ({
                ok: false,
                status: 404
            }));

            const release = await getLatestRelease('newguy/emptyrepo');
            assert.strictEqual(release, null);
        });
    });
});