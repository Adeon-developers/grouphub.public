function buildGroupBox(config, userOrOrg) {
    const label = "Skupiny";

    const box = document.createElement("div");
    box.id = "my-box";
    box.style.cssText = `
        background-color: #161B22;
        color: #F1F6FB;
        margin-bottom: 16px;
        margin-left: 8px;
        border-radius: 8px;
        border: 1px solid #30353C;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    `;

    if (!config || !config.group) {
        box.textContent = `📦 ${label} — 'github.com/${userOrOrg}/grouphub.public/config.json' missing`;
        return box;
    }

    const header = document.createElement("div");
    header.style.padding = "8px";
    header.innerHTML = `<strong style="font-size: 16px">📦 ${config.group.length} ${label}</strong>`;
    box.appendChild(header);

    config.group.forEach(group => {
        box.appendChild(createGroupRecursive(group, userOrOrg, 0));
    });

    return box;
}


function createGroupRecursive(group, userOrOrg, level) {
    const section = document.createElement("div");

    const line = document.createElement("hr");
    line.style.cssText = `
        border: none;
        border-top: 1px solid #30353C;
        margin: 0px;
    `;
    section.appendChild(line);

    const paddingLeft = 8 + level * 14;

    const groupLabel = document.createElement("div");
    groupLabel.style.cssText = `
        font-weight: 600;
        cursor: pointer;
        padding: 8px;
        padding-left: ${paddingLeft}px;
        display: flex;
        align-items: center;
    `;
    groupLabel.innerHTML = `<b>[▸] ${group.name}</b>`;
    section.appendChild(groupLabel);
    const container = document.createElement("div");
    container.style.display = "none";
    const repoContainer = document.createElement("div");
    repoContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    `;
    const subgroupContainer = document.createElement("div");
    subgroupContainer.style.display = "block";


    groupLabel.addEventListener("click", () => {
        const isHidden = container.style.display === "none";
        container.style.display = isHidden ? "block" : "none";
        groupLabel.innerHTML = `<b>${isHidden ? "[▾]" : "[▸]"} ${group.name}</b>`;
    });


    if (group.repos) {
        group.repos.sort().forEach(repoName => {
            const repoItem = document.createElement("div");
            repoItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 6px;
                margin: 6px;
                padding: 6px;
                border: 1px solid #3E444C;
                border-radius: 6px;
                background-color: #22282F;
            `;

            repoItem.innerHTML = `
                <a href="https://github.com/${userOrOrg}/${repoName}" target="_blank"
                   style="font-weight: 500; color: #0969da; text-decoration: none;">
                    ${repoName}
                </a>
            `;

            repoContainer.appendChild(repoItem);
        });
    }

    if (group.group) {
        group.group.forEach(subGroup => {
            subgroupContainer.appendChild(
                createGroupRecursive(subGroup, userOrOrg, level + 1)
            );
        });
    }


    container.appendChild(repoContainer);
    container.appendChild(subgroupContainer);
    section.appendChild(container);

    return section;
}