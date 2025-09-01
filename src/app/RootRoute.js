import App from 'app/components/App';
import FeedPage from 'app/components/pages/FeedPage';
import PostPage from 'app/components/pages/PostPage';
import About from 'app/components/pages/About';
import Welcome from 'app/components/pages/Welcome';
import Faq from 'app/components/pages/Faq';
import Login from 'app/components/pages/Login';
import Privacy from 'app/components/pages/Privacy';
import Support from 'app/components/pages/Support';
import Benchmark from 'app/components/pages/Benchmark';
import TagsIndex from 'app/components/pages/TagsIndex';
import Tos from 'app/components/pages/Tos';
import ChangePasswordPage from 'app/components/pages/ChangePasswordPage';
import RecoverAccountStep1 from 'app/components/pages/RecoverAccountStep1';
import Witnesses from 'app/components/pages/Witnesses';
import SubmitPost from 'app/components/pages/SubmitPost';
import SubmitPostServerRender from 'app/components/pages/SubmitPostServerRender';
import UserProfile from 'app/components/pages/UserProfile';
import PostPageNoCategory from 'app/components/pages/PostPageNoCategory';
import NotFound from 'app/components/pages/NotFound';
import resolveRoute from './ResolveRoute';

// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

 export default {
     path: '/',
     component: App,
    indexRoute: { component: FeedPage }, // homepage -> FeedPage

     getChildRoutes(nextState, cb) {
         const route = resolveRoute(nextState.location.pathname);

         switch (route.page) {
             case 'About': cb(null, [About]); break;
             case 'Welcome': cb(null, [Welcome]); break;
             case 'Faq': cb(null, [Faq]); break;
             case 'Login': cb(null, [Login]); break;
             case 'Privacy': cb(null, [Privacy]); break;
             case 'Support': cb(null, [Support]); break;
             case 'XSSTest':
                 if (process.env.NODE_ENV === 'development') cb(null, [require('app/components/pages/XSS')]);
                 break;
             case 'Benchmark': cb(null, [Benchmark]); break;
             case 'Tags': cb(null, [TagsIndex]); break;
             case 'Tos': cb(null, [Tos]); break;
             case 'ChangePassword': cb(null, [ChangePasswordPage]); break;
             case 'RecoverAccountStep1': cb(null, [RecoverAccountStep1]); break;
             case 'Witnesses': cb(null, [Witnesses]); break;
             case 'SubmitPost':
                 if (process.env.BROWSER) cb(null, [SubmitPost]);
                 else cb(null, [SubmitPostServerRender]);
                 break;
             case 'UserProfile': cb(null, [UserProfile]); break;
             case 'Post': cb(null, [PostPage]); break;
            case 'PostNoCategory': cb(null, [PostPageNoCategory]); break;
            case 'PostsIndex':
                cb(null, [FeedPage]);
                break;
            case 'IndexHtml': // explicit handling so /index.html is feed, not post
                cb(null, [FeedPage]);
                break;
             default:
                 cb(process.env.BROWSER ? null : Error(404), [NotFound]);
         }
     },
 };

