/* eslint react/display-name: 0 */
/* eslint space-before-function-paren:0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import rootReducer from 'app/redux/RootReducer';
import rootSaga from 'shared/RootSaga';
import RootRoute from 'app/RootRoute';
import Translator from 'app/Translator';
import ScrollBehavior from 'scroll-behavior';
import { api } from '@blurtfoundation/blurtjs';

// --- Scroll constants ---
const SCROLL_TOP_EXTRA_PIXEL_OFFSET = 3;
const SCROLL_TOP_TRIES = 50;
const SCROLL_TOP_DELAY_MS = 100;
const SCROLL_FUDGE_PIXELS = 10;
const SCROLL_DIRECTION_UP = 'up';
const SCROLL_DIRECTION_DOWN = 'down';
const DISABLE_ROUTER_HISTORY_NAV_DIRECTION_EL_ID = 'disable_router_nav_history_direction_check';

let scrollTopTimeout = null;

// --- Stub offchain to prevent saga errors ---
if (!window.offchain) window.offchain = {};
if (typeof window.offchain.syncSpecialPosts !== 'function') {
    window.offchain.syncSpecialPosts = () => console.warn('syncSpecialPosts stub called - no-op');
}

const calcOffsetRoot = (startEl) => {
    let offset = 0, el = startEl;
    while (el) {
        offset += el.offsetTop;
        el = el.offsetParent;
    }
    return offset;
};

const scrollTop = (el, topOffset, prevDocumentInfo, triesRemaining) => {
    const documentInfo = {
        scrollHeight: document.body.scrollHeight,
        scrollTop: Math.ceil(document.scrollingElement.scrollTop),
        scrollTarget: calcOffsetRoot(el) + topOffset,
        direction: prevDocumentInfo.direction,
    };
    let doScroll = false;
    if (prevDocumentInfo.direction === SCROLL_DIRECTION_DOWN) {
        doScroll =
            prevDocumentInfo.scrollTop <= documentInfo.scrollTop + SCROLL_FUDGE_PIXELS &&
            (documentInfo.scrollTop < documentInfo.scrollTarget ||
                prevDocumentInfo.scrollTarget < documentInfo.scrollTarget ||
                prevDocumentInfo.scrollHeight < documentInfo.scrollHeight);
    } else if (prevDocumentInfo.direction === SCROLL_DIRECTION_UP) {
        doScroll =
            prevDocumentInfo.scrollTop >= documentInfo.scrollTop - SCROLL_FUDGE_PIXELS &&
            (documentInfo.scrollTop > documentInfo.scrollTarget ||
                prevDocumentInfo.scrollTarget > documentInfo.scrollTarget ||
                prevDocumentInfo.scrollHeight > documentInfo.scrollHeight);
    }

    if (doScroll) {
        window.scrollTo(0, documentInfo.scrollTarget);
        if (triesRemaining > 0) {
            scrollTopTimeout = setTimeout(
                () => scrollTop(el, topOffset, documentInfo, triesRemaining - 1),
                SCROLL_TOP_DELAY_MS
            );
        }
    }
};

class OffsetScrollBehavior extends ScrollBehavior {
    scrollToTarget(element, target) {
        clearTimeout(scrollTopTimeout);
        const header = document.getElementsByTagName('header')[0];
        let topOffset = SCROLL_TOP_EXTRA_PIXEL_OFFSET * -1;
        if (header) topOffset += header.offsetHeight * -1;

        let el = false;
        if (typeof target === 'string') {
            el = document.getElementById(target.substr(1)) || document.getElementById(target);
        }

        if (el) {
            const documentInfo = {
                scrollHeight: document.body.scrollHeight,
                scrollTop: Math.ceil(document.scrollingElement.scrollTop),
                scrollTarget: calcOffsetRoot(el) + topOffset,
            };
            documentInfo.direction =
                documentInfo.scrollTop < documentInfo.scrollTarget
                    ? SCROLL_DIRECTION_DOWN
                    : SCROLL_DIRECTION_UP;
            scrollTop(el, topOffset, documentInfo, SCROLL_TOP_TRIES);
        } else {
            super.scrollToTarget(element, target);
        }
    }
}

const bindMiddleware = (middleware) => applyMiddleware(...middleware);
import { fromJS, List, Map } from 'immutable';

async function fetchInitialState() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    let content = Map();
    let accounts = Map();
    let discussion_idx = fromJS({ created: { '': [] } });

    try {
        if (parts.length === 0) {
            const discussions = await api.getDiscussionsByCreatedAsync({ tag: '', limit: 20 });
            discussions.forEach((post) => {
                const key = `${post.author}/${post.permlink}`;
                content = content.set(key, fromJS(post));
                discussion_idx = discussion_idx.updateIn(['created', ''], list => list.push(key));
                if (!accounts.has(post.author)) {
                    const [accountData] = await api.getAccountsAsync([post.author]);
                    if (accountData) accounts = accounts.set(post.author, fromJS(accountData));
                }
            });
        } else if (parts.length === 2) {
            const [author, permlink] = parts;
            const post = await api.getContentAsync(author, permlink);
            if (post && post.author) {
                const key = `${author}/${permlink}`;
                content = content.set(key, fromJS(post));
                const [accountData] = await api.getAccountsAsync([author]);
                if (accountData) accounts = accounts.set(author, fromJS(accountData));
            }
        }
    } catch (err) {
        console.error('Error fetching initial state:', err);
    }

    return fromJS({
        app: {},
        global: { content, accounts, discussion_idx },
        offchain: { special_posts: { featured_posts: [], promoted_posts: [] }, syncSpecialPosts: () => {} },
    });
}

// --- Client-side render ---
export async function clientRender() {
    const sagaMiddleware = createSagaMiddleware();
    const initialState = await fetchInitialState();
    const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);

    const history = syncHistoryWithStore(browserHistory, store);

    const scroll = useScroll({
        createScrollBehavior: (config) => new OffsetScrollBehavior(config),
        shouldUpdateScroll: (prevLocation, { location }) => {
            if (location.hash) {
                const disableNav = document.getElementById(DISABLE_ROUTER_HISTORY_NAV_DIRECTION_EL_ID);
                if (disableNav || (prevLocation === null && location.action === 'POP') || location.action === 'PUSH') {
                    return location.hash;
                }
            }
            return true;
        },
    });

    ReactDOM.render(
        <Provider store={store}>
            <Translator>
                <Router
                    routes={RootRoute}
                    history={history}
                    render={applyRouterMiddleware(scroll)}
                />
            </Translator>
        </Provider>,
        document.getElementById('content')
    );
}

