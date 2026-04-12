function getHeaders () {
    const headers = {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'My-Release-Notifier-App',
            };

    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

    return headers;
}

export default async function apiClient(url) {
    let response;
    try { 
        response = await fetch(url, { 
            headers: getHeaders(),
        });

        if (response.ok) return response.json();

    } catch (error) {
        const err = new Error('Failed to reach GitHub API');
        err.status = 502;
        throw err;
    } 
        if (response.status === 404) {
            const err = new Error('Resource not found');
            err.status= 404;
            throw err;
        };

        if (response.status === 429 || response.status === 403) {
            const retryAfterSec =
                response.headers.get('retry-after') ||
                response.headers.get('x-ratelimit-reset');

            const err = new Error('GitHub API rate limit exceeded');
            err.status= 429;
            err.retryAfter = retryAfterSec;
            throw err;
        }
}
