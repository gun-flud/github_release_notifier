// export default async function apiClient(path, options = {}) {
export default async function apiClient(owner, repo, options = {}) {
    try { 
        const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;   
        //const URL = `https://api.github.com/repos/${path}`;

        const { headers: headersOpt, ...resOpt } = options;

        const response = await fetch(URL, {
            ...resOpt,
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'My-Release-Notifier-App',
                ...headersOpt,
            },
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        return result;
    } catch (err) {
        return handleErrors(err.message || err);
    }
}
