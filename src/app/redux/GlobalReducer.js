import { Map, Set, List, fromJS, Iterable } from 'immutable';
import resolveRoute from 'app/ResolveRoute';
import { emptyContent } from 'app/redux/EmptyState';
import { contentStats } from 'app/utils/StateFunctions';
import constants from './constants';

export const emptyContentMap = Map(emptyContent);

export const defaultState = Map({
    status: {},
    content: Map(), // ✅ ensure content is always initialized
});

// Action constants
const SET_COLLAPSED = 'global/SET_COLLAPSED';
const RECEIVE_STATE = 'global/RECEIVE_STATE';
const RECEIVE_ACCOUNT = 'global/RECEIVE_ACCOUNT';
const RECEIVE_ACCOUNTS = 'global/RECEIVE_ACCOUNTS';
const SYNC_SPECIAL_POSTS = 'global/SYNC_SPECIAL_POSTS';
const RECEIVE_CONTENT = 'global/RECEIVE_CONTENT';
const LINK_REPLY = 'global/LINK_REPLY';
const DELETE_CONTENT = 'global/DELETE_CONTENT';
const VOTED = 'global/VOTED';
const FETCHING_DATA = 'global/FETCHING_DATA';
const RECEIVE_DATA = 'global/RECEIVE_DATA';
const SET = 'global/SET';
const REMOVE = 'global/REMOVE';
const UPDATE = 'global/UPDATE';
const FETCH_JSON = 'global/FETCH_JSON';
const FETCH_JSON_RESULT = 'global/FETCH_JSON_RESULT';
const SHOW_DIALOG = 'global/SHOW_DIALOG';
const HIDE_DIALOG = 'global/HIDE_DIALOG';
// Saga-related:
export const GET_STATE = 'global/GET_STATE';
const RECEIVE_NOTIFICATIONS = 'global/RECEIVE_NOTIFICATIONS';
const RECEIVE_UNREAD_NOTIFICATIONS = 'global/RECEIVE_UNREAD_NOTIFICATIONS';

const transformAccount = (account) =>
    fromJS(account, (key, value) => {
        if (key === 'witness_votes') return value.toSet();
        const isIndexed = Iterable.isIndexed(value);
        return isIndexed ? value.toList() : value.toOrderedMap();
    });

const mergeAccounts = (state, account) => {
    return state.updateIn(['accounts', account.get('name')], Map(), (a) =>
        a.mergeDeep(account)
    );
};

export default function reducer(state = defaultState, action = {}) {
    const payload = action.payload;

    // Set post category
    const pathname = state.get('pathname');
    if (pathname) {
        const route = resolveRoute(pathname);
        if (route.page === 'PostsIndex') {
            const postCategory = route.params[1];
            state = state.set('postCategory', postCategory);
        }
    }

    switch (action.type) {
        case SET_COLLAPSED: {
            return state.withMutations((map) => {
                map.updateIn(['content', payload.post], Map(), (value) =>
                    (value || Map()).merge(Map({ collapsed: payload.collapsed }))
                );
            });
        }

        case RECEIVE_STATE: {
            let new_state = fromJS(payload);
            if (new_state.has('content')) {
                let content = new_state.get('content') || Map();
                content = content.withMutations((c) => {
                    c.forEach((cc, key) => {
                        cc = emptyContentMap.mergeDeep(cc);
                        const stats = fromJS(contentStats(cc));
                        c.setIn([key, 'stats'], stats);
                    });
                });
                new_state = new_state.set('content', content);
            }
            return state.mergeDeep(new_state);
        }

        case RECEIVE_NOTIFICATIONS: {
            return state.updateIn(['notifications', payload.name], Map(), (n) =>
                (n || Map()).withMutations((nmut) =>
                    nmut.update('notifications', List(), (a) =>
                        a.concat(fromJS(payload.notifications))
                    )
                )
            );
        }

        case RECEIVE_UNREAD_NOTIFICATIONS: {
            return state.updateIn(
                ['unread_notifications', payload.name],
                Map(),
                (n) =>
                    (n || Map()).withMutations((nmut) =>
                        nmut.update('unread_notifications', List(), (a) =>
                            a.concat(fromJS(payload.notifications))
                        )
                    )
            );
        }

        case RECEIVE_ACCOUNT: {
            const account = transformAccount(payload.account);
            return mergeAccounts(state, account);
        }

        case RECEIVE_ACCOUNTS: {
            return payload.accounts.reduce((acc, curr) => {
                const transformed = transformAccount(curr);
                return mergeAccounts(acc, transformed);
            }, state);
        }

        case SYNC_SPECIAL_POSTS: {
            return (payload.featuredPosts || [])
                .concat(payload.promotedPosts || [])
                .reduce((acc, specialPost) => {
                    const author = specialPost.get('author');
                    const permlink = specialPost.get('permlink');
                    return acc.updateIn(
                        ['content', `${author}/${permlink}`],
                        Map(),
                        (p) => (p || Map()).mergeDeep(specialPost)
                    );
                }, state);
        }

        case RECEIVE_CONTENT: {
            const content = fromJS(payload.content);
            const key = content.get('author') + '/' + content.get('permlink');
            return state.updateIn(['content', key], Map(), (c) => {
                c = emptyContentMap.mergeDeep(c || Map());
                c = c.delete('active_votes');
                c = c.mergeDeep(content);
                c = c.set('stats', fromJS(contentStats(c)));
                return c;
            });
        }

        case LINK_REPLY: {
            const {
                author,
                permlink,
                parent_author = '',
                parent_permlink = '',
            } = payload;
            if (parent_author === '' || parent_permlink === '') return state;
            const key = author + '/' + permlink;
            const parent_key = parent_author + '/' + parent_permlink;
            let updatedState = state.updateIn(
                ['content', parent_key, 'replies'],
                List(),
                (l) => (l.findIndex((i) => i === key) === -1 ? l.push(key) : l)
            );
            const children = updatedState.getIn(
                ['content', parent_key, 'replies'],
                List()
            ).size;
            updatedState = updatedState.updateIn(
                ['content', parent_key, 'children'],
                0,
                () => children
            );
            return updatedState;
        }

        case DELETE_CONTENT: {
            const { author, permlink } = payload;
            const key = author + '/' + permlink;
            const content = state.getIn(['content', key], Map());
            const parent_author = content.get('parent_author') || '';
            const parent_permlink = content.get('parent_permlink') || '';
            let updatedState = state.deleteIn(['content', key]);
            if (parent_author !== '' && parent_permlink !== '') {
                const parent_key = parent_author + '/' + parent_permlink;
                updatedState = updatedState.updateIn(
                    ['content', parent_key, 'replies'],
                    List(),
                    (r) => r.filter((i) => i !== key)
                );
            }
            return updatedState;
        }

        case VOTED: {
            const { username, author, permlink, weight } = payload;
            const key = ['content', author + '/' + permlink, 'active_votes'];
            let active_votes = state.getIn(key, List());
            const idx = active_votes.findIndex(
                (v) => v.get('voter') === username
            );
            if (idx === -1) {
                active_votes = active_votes.push(
                    Map({ voter: username, percent: weight })
                );
            } else {
                active_votes = active_votes.set(
                    idx,
                    Map({ voter: username, percent: weight })
                );
            }
            return state.setIn(key, active_votes);
        }

        case FETCHING_DATA: {
            const { order, category } = payload;
            return state.updateIn(
                ['status', category || '', order],
                () => ({ fetching: true })
            );
        }

        case RECEIVE_DATA: {
            const {
                data,
                order,
                category,
                accountname,
                fetching,
                endOfData,
            } = payload;
            let new_state = state;

            if (
                order === 'by_author' ||
                order === 'by_feed' ||
                order === 'by_comments' ||
                order === 'by_replies'
            ) {
                const key = ['accounts', accountname, category];
                new_state = state.updateIn(key, List(), (list) =>
                    (list || List()).withMutations((posts) => {
                        data.forEach((value) => {
                            const key = `${value.author}/${value.permlink}`;
                            if (!posts.includes(key)) posts.push(key);
                        });
                    })
                );
            } else {
                new_state = state.updateIn(
                    ['discussion_idx', category || '', order],
                    List(),
                    (list) =>
                        (list || List()).withMutations((posts) => {
                            data.forEach((value) => {
                                const key = `${value.author}/${value.permlink}`;
                                if (!posts.includes(key)) posts.push(key);
                            });
                        })
                );
            }

            new_state = new_state.updateIn(['content'], Map(), (content) =>
                (content || Map()).withMutations((map) => {
                    data.forEach((value) => {
                        const key = `${value.author}/${value.permlink}`;
                        let val = fromJS(value);
                        val = val.set('stats', fromJS(contentStats(val)));
                        map.set(key, val);
                    });
                })
            );

            new_state = new_state.updateIn(
                ['status', category || '', order],
                () =>
                    endOfData
                        ? { fetching, last_fetch: new Date() }
                        : { fetching }
            );
            return new_state;
        }

        case SET: {
            const { key, value } = payload;
            const key_array = Array.isArray(key) ? key : [key];
            return state.setIn(key_array, fromJS(value));
        }

        case REMOVE: {
            const key = Array.isArray(payload.key)
                ? payload.key
                : [payload.key];
            return state.removeIn(key);
        }

        case UPDATE: {
            const { key, notSet = Map(), updater } = payload;
            return state.updateIn(key, notSet, updater);
        }

        case FETCH_JSON: {
            return state;
        }

        case FETCH_JSON_RESULT: {
            const { id, result, error } = payload;
            return state.set(id, fromJS({ result, error }));
        }

        case SHOW_DIALOG: {
            const { name, params = {} } = payload;
            return state.update('active_dialogs', Map(), (d) =>
                d.set(name, fromJS({ params }))
            );
        }

        case HIDE_DIALOG: {
            return state.update('active_dialogs', (d) =>
                d.delete(payload.name)
            );
        }

        default:
            return state;
    }
}

// Action creator
export function receiveState(payload) {
    return {
        type: RECEIVE_STATE,
        payload,
    };
}

