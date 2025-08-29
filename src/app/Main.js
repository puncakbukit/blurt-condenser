import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import { clientRender } from 'shared/UniversalRender';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-179023138-1', { titleCase: false });
ReactGA.pageview(window.location.pathname + window.location.search);

document.addEventListener('DOMContentLoaded', () => {
  clientRender({
    app: {},
    global: {},
    offchain: {},
    user: {},
  });
});

