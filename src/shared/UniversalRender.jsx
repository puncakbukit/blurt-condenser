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

// --- Client-side data fetch ---
async function fetchInitialState() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    const content = {};
    const accounts = {};

    // If path looks like /author/permlink
    if (parts.length === 2) {
        const [author, permlink] = parts;
        try {
            const post = await api.getContentAsync(author, permlink);
            if (post && post.author) {
                content[`${author}/${permlink}`] = post;
                const accountData = await api.getAccountsAsync([author]);
                if (accountData.length) accounts[author] = accountData[0];
            }
        } catch (err) {
            console.error('Error fetching post or account:', err);
        }
    }

    return {
        app: {},
        global: { content, accounts },
        offchain: {
           special_posts: { featured_posts: [], promoted_posts: [] },
           // stub to prevent client-side error
           syncSpecialPosts: () => {}, 
        },
    };
}

export async function clientRender() {
    const sagaMiddleware = createSagaMiddleware();

    // Populate store with live content/accounts
    const initialState = await fetchInitialState();
    const store = createStore(rootReducer, initialState, bindMiddleware([sagaMiddleware]));
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

