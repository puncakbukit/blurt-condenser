import { fromJS } from 'immutable';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import tt from 'counterpart';
import { api } from '@blurtfoundation/blurtjs';
import * as globalActions from './GlobalReducer';
import * as appActions from './AppReducer';
import * as transactionActions from './TransactionReducer';
import { setUserPreferences } from 'app/utils/ServerApiClient';
import { getStateAsync } from 'app/utils/steemApi';

const wait = (ms) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });

export const sharedWatches = [
    takeEvery(globalActions.GET_STATE, getState),
    takeLatest(
        [
            appActions.SET_USER_PREFERENCES,
            appActions.TOGGLE_NIGHTMODE,
            appActions.TOGGLE_BLOGMODE,
        ],
        saveUserPreferences
    ),
    takeEvery('transaction/ERROR', showTransactionErrorNotification),
];

export function* getAccount(username, force = false) {
    let account = yield select((state) =>
        state.global.get('accounts').get(username)
    );

    const isLite = !!account && !account.get('owner');

    if (!account || force || isLite) {
        console.log(
            'getAccount: loading',
            username,
            'force?',
            force,
            'lite?',
            isLite
        );

        [account] = yield call([api, api.getAccountsAsync], [username]);
        if (account) {
            account = fromJS(account);
            yield put(globalActions.receiveAccount({ account }));
        }
    }
    return account;
}

// --- PATCH: safe wrapper for receiveState ---
function safePutReceiveState(state) {
    if (globalActions && typeof globalActions.receiveState === 'function') {
        return put(globalActions.receiveState(state));
    } else {
        console.warn('globalActions.receiveState is missing or not a function', globalActions);
        return null; // no-op
    }
}
// ----------------------------

/** Manual refreshes. The router is in FetchDataSaga. */
export function* getState({ payload: { url } }) {
    try {
        // Minimal state builder
        let state = {
            content: {},
            accounts: {},
            discussion_idx: {},
        };

        // Normalize the url
        url = url.split('?')[0].replace(/^\/+|\/+$/g, '');
        let page = url;
        if (url === '') page = 'hot';

        let discussions = [];
        if (page.startsWith('trending') || page === 'trending') {
            discussions = yield call([api, api.getDiscussionsByTrendingAsync], { tag: '', limit: 20 });
        } else if (page.startsWith('hot') || page === 'hot') {
            discussions = yield call([api, api.getDiscussionsByHotAsync], { tag: '', limit: 20 });
        } else if (page.startsWith('created') || page === 'created') {
            discussions = yield call([api, api.getDiscussionsByCreatedAsync], { tag: '', limit: 20 });
        }

        // Fill state.content + index with posts
        if (discussions && discussions.length) {
            state.discussion_idx[page] = { '': [] };
            for (let d of discussions) {
                state.content[`${d.author}/${d.permlink}`] = d;
                state.discussion_idx[page][''].push(`${d.author}/${d.permlink}`);
            }
        }
        yield safePutReceiveState(state);
    } catch (error) {
        console.error('~~ Saga getState error ~~>', url, error);
        yield put(appActions.steemApiError(error.message));
    }
}

function* showTransactionErrorNotification() {
    const errors = yield select((state) => state.transaction.get('errors'));
    for (const [key, message] of errors) {
        if (key !== 'bandwidthError' && key !== 'transactionFeeError') {
            yield put(appActions.addNotification({ key, message }));
            yield put(transactionActions.deleteError({ key }));
        }
    }
}

export function* getContent({ author, permlink, resolve, reject }) {
    // Skip invalid posts (like homepage or .html files)
    if (!author || !permlink || permlink.endsWith('.html')) {
        console.warn('Skipping getContent for non-post', { author, permlink });
        if (reject) reject();
        return;
    }

    let content;
    while (!content) {
        content = yield call([api, api.getContentAsync], author, permlink);
        if (!content || content.author === '') {
            // retry if content not found
            content = null;
            yield call(wait, 3000);
        }
    }

    yield put(globalActions.receiveContent({ content }));
    if (resolve && content) resolve(content);
    else if (reject && !content) reject();
}

function* saveUserPreferences({ payload }) {
    if (payload) {
        yield setUserPreferences(payload);
    }

    const prefs = yield select((state) => state.app.get('user_preferences'));
    yield setUserPreferences(prefs.toJS());
}

