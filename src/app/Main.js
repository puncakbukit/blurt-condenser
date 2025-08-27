import '@babel/register';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import store from 'store';
import { VIEW_MODE_WHISTLE, PARAM_VIEW_MODE } from 'shared/constants';
import './assets/stylesheets/app.scss';
import plugins from 'app/utils/JsPlugins';
import Iso from 'iso';
import { clientRender } from 'shared/UniversalRender';
import ConsoleExports from './utils/ConsoleExports';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import * as blurtjs from '@blurtfoundation/blurtjs';
import { determineViewMode } from 'app/utils/Links';
import frontendLogger from 'app/utils/FrontendLogger';
import ReactGA from 'react-ga';

window.addEventListener('error', frontendLogger);

const CMD_LOG_T = 'log-t';
const CMD_LOG_TOGGLE = 'log-toggle';
const CMD_LOG_O = 'log-on';

try {
    if (process.env.NODE_ENV === 'development') {
        // Adds some object refs to the global window object
        ConsoleExports.init(window);
    }
} catch (e) {
    console.error(e);
}

ReactGA.initialize('UA-179023138-1', {
    titleCase: false,
    gaOptions: {
        siteSpeedSampleRate: 100,
    },
});
ReactGA.pageview(window.location.pathname + window.location.search);

function runApp(initial_state) {
    console.log('Initial state', initial_state);

    const konami = {
        code: 'xyzzy',
        enabled: false,
    };
    const buff = konami.code.split('');
    const cmd = (command) => {
        console.log('got command:' + command);
        switch (command) {
            case CMD_LOG_O:
                konami.enabled = false;
            case CMD_LOG_TOGGLE:
            case CMD_LOG_T:
                konami.enabled = !konami.enabled;
                if (konami.enabled) {
                    blurtjs.api.setOptions({ logger: console });
                } else {
                    blurtjs.api.setOptions({ logger: false });
                }
                return 'api logging ' + konami.enabled;
            default:
                return 'That command is not supported.';
        }
        // return 'done';
    };

    const enableKonami = () => {
        if (!window.s) {
            console.log('The cupie doll is yours.');
            window.s = (command) => {
                return cmd.call(this, command);
            };
        }
    };

    window.document.body.onkeypress = (e) => {
        buff.shift();
        buff.push(e.key);
        if (buff.join('') === konami.code) {
            enableKonami();
            cmd(CMD_LOG_T);
        }
    };

    if (window.location.hash.indexOf('#' + konami.code) === 0) {
        enableKonami();
        cmd(CMD_LOG_O);
    }

    const config = initial_state.offchain.config;
    const alternativeApiEndpoints = config.alternative_api_endpoints;

    const currentApiEndpoint =
        localStorage.getItem('user_preferred_api_endpoint') === null
            ? config.blurtd_connection_client
            : localStorage.getItem('user_preferred_api_endpoint');
    blurtjs.api.setOptions({
        url: currentApiEndpoint,
        retry: true,
        useAppbaseApi: !!config.blurtd_use_appbase,
        alternative_api_endpoints: alternativeApiEndpoints,
        failover_threshold: config.failover_threshold,
    });
    blurtjs.config.set('address_prefix', config.address_prefix);
    blurtjs.config.set('chain_id', config.chain_id);
    window.$STM_Config = config;
    plugins(config);
    if (initial_state.offchain.serverBusy) {
        window.$STM_ServerBusy = true;
    }
    if (initial_state.offchain.csrf) {
        window.$STM_csrf = initial_state.offchain.csrf;
        delete initial_state.offchain.csrf;
    }

    initial_state.app.viewMode = determineViewMode(window.location.search);

    const locale = store.get('language');
    if (locale) initial_state.user.locale = locale;
    initial_state.user.maybeLoggedIn = !!store.get('autopost2');
    if (initial_state.user.maybeLoggedIn) {
        const username = new Buffer(store.get('autopost2'), 'hex')
            .toString()
            .split('\t')[0];
        initial_state.user.current = {
            username,
        };
    }

    const location = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    try {
        clientRender(initial_state);
    } catch (error) {
        console.error(error);
        serverApiRecordEvent('client_error', error);
    }
}

if (!window.Intl) {
    require.ensure(
        ['intl/dist/Intl'],
        (require) => {
            window.IntlPolyfill = window.Intl = require('intl/dist/Intl');
            require('intl/locale-data/jsonp/en-US.js');
            require('intl/locale-data/jsonp/es.js');
            require('intl/locale-data/jsonp/ru.js');
            require('intl/locale-data/jsonp/fr.js');
            require('intl/locale-data/jsonp/it.js');
            require('intl/locale-data/jsonp/ko.js');
            require('intl/locale-data/jsonp/ja.js');
            Iso.bootstrap(runApp);
        },
        'IntlBundle'
    );
} else {
    Iso.bootstrap(runApp);
}
