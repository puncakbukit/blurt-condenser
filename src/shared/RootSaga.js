import { all } from 'redux-saga/effects';
import { fetchDataWatches } from 'app/redux/FetchDataSaga';
import { sharedWatches } from 'app/redux/SagaShared';
import { userWatches } from 'app/redux/UserSaga';
import { authWatches } from 'app/redux/AuthSaga';
import { transactionWatches } from 'app/redux/TransactionSaga';
import { watchPollingTasks } from 'app/redux/PollingSaga';

// Utility to filter out any saga we don't want in SPA mode
function filterWatches(watches) {
    return watches.filter(w => {
        // skip sagas that reference syncSpecialPosts
        if (w.name && w.name.toLowerCase().includes('special')) {
            console.warn(`Disabled saga watcher: ${w.name}`);
            return false;
        }
        return true;
    });
}

export default function* rootSaga() {
    yield all([
        ...userWatches, // keep first to remove keys early when a page change happens
        ...fetchDataWatches,
        ...filterWatches(sharedWatches),
        ...authWatches,
        ...transactionWatches,
        watchPollingTasks(),
    ]);
}

