async function fetchGroupHubConfig(userOrOrg) {
    const urls = [
        `https://raw.githubusercontent.com/${userOrOrg}/grouphub.public/main/config.json`,
        `https://raw.githubusercontent.com/${userOrOrg}/grouphub.public/refs/heads/main/config.json`
    ];

    for (const url of urls) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            
            if (!data || !Array.isArray(data.group)) {
                console.warn(`Invalid format at ${url}`);
                continue; // try next URL
            }

            return data; // success
        } catch (err) {
            console.warn(`Failed to load config from ${url}:`, err.message);
        }
    }

    console.warn(`All config URLs failed for ${userOrOrg}`);
    return null;
}