type ScrollIntoViewRequest = {
    el: HTMLElement;
    options: ScrollIntoViewOptions;
    priority: number;
};

const ESTIMATED_SCROLL_DURATION = 1000;

let isBrowserScrolling = false; // lock
let pendingRequests: ScrollIntoViewRequest[] = [];

function next(): ScrollIntoViewRequest | null {
    if (!pendingRequests.length) return null;
    const req = pendingRequests.shift();
    return req && req.el && req.el.parentElement ? req : next();
}

function unlock() {
    pendingRequests.sort((a, b) => b.priority - a.priority);
    const req = next();
    if (req) {
        req.el.scrollIntoView(req.options);
        setTimeout(unlock, ESTIMATED_SCROLL_DURATION);
    } else {
        isBrowserScrolling = false;
    }
}

/**
 * This locking mechanism provides a workaround for a bug in Chrome/Chromium that cancels
 * all ongoing smooth scrolling actions (e.g. previous calls to `scrollIntoView`)
 * See this discussion on StackOverflow: https://stackoverflow.com/a/63563437
 */
export function requestScrollIntoView(el: HTMLElement, options: ScrollIntoViewOptions, priority = 0) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let abort = () => {};
    if (!isBrowserScrolling) {
        isBrowserScrolling = true;
        el.scrollIntoView(options);
        setTimeout(unlock, ESTIMATED_SCROLL_DURATION);
    } else {
        const newReq = { el, options, priority };
        pendingRequests.push(newReq);
        abort = () => {
            pendingRequests = pendingRequests.filter((req) => req !== newReq);
        };
    }
    return abort;
}
