import React from 'react';

const regex = {
    sanitize: /^(https?:)?\/\/fast.wistia.com\/embed\/iframe\/([a-z0-9]*)/i,
    main: /(?:https?:\/\/([a-z0-9\-.\/]*).wistia.com\/medias\/)([a-z0-9]+)/,
    contentId: /(?:([a-z0-9\-.\/]*).wistia.com\/medias\/)([a-z0-9]+)/,
};

export default regex;
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin', 'allow-popups'],
};

export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);
    if (!match || match.length !== 3) {
        return false;
    }
    return match[0];
}
export function normalizeEmbedUrl(url) {
    const match = url.match(regex.contentId);
    if (match && match.length >= 2) {
        return `https://fast.wistia.com/embed/iframe/${match[2]}`;
    }

    return false;
}

function extractMetadata(data) {
    if (!data) return null;
    const m = data.match(regex.main);
    if (!m || m.length < 2) return null;

    return {
        id: m[2],
        url: m[0],
        canonical: `https://fast.wistia.com/embed/iframe/${m[2]}`,
    };
}

export function embedNode(child, links /* images */) {
    try {
        const { data } = child;
        const wistia = extractMetadata(data);
        if (!wistia) return child;

        const wistiaRegex = new RegExp(`${wistia.url}?`);

        child.data = data.replace(
            wistiaRegex,
            `~~~ embed:${wistia.id} wistia ~~~`
        );

        if (links) links.add(wistia.canonical);
    } catch (error) {
        console.log(error);
    }
    return child;
}

export function genIframeMd(idx, id, w, h) {
    const url = `https://fast.wistia.com/embed/iframe/${id}`;
    return (
        <div key={`wistia-${id}-${idx}`} className="videoWrapper">
            <iframe
                title="Wistia embedded player"
                src={url}
                width={w}
                height={h}
                frameBorder="0"
                webkitallowfullscreen
                mozallowfullscreen
                allowFullScreen
                sandbox={
                    sandboxConfig.useSandbox
                        ? sandboxConfig.sandboxAttributes
                            ? sandboxConfig.sandboxAttributes.join(' ')
                            : true
                        : ''
                }
            />
        </div>
    );
}
