import React from 'react';
import Icon from 'app/components/elements/Icon';
import BlurtLogo from 'app/components/elements/BlurtLogo';

class NotFound extends React.Component {
    render() {
        return (
            <div>
                <div className="row Header__nav">
                    <div className="small-5 large-4 columns Header__logotype">
                        <a href="/">
                            <BlurtLogo />
                        </a>
                    </div>
                </div>
                <div className="NotFound float-center">
                    <div>
                        <Icon name="blurt" size="4x" />
                        <h4 className="NotFound__header">
                            Sorry! This page doesn't exist.
                        </h4>
                        <p>
                            Not to worry. You can head back to{' '}
                            <a style={{ fontWeight: 800 }} href="/">
                                our homepage
                            </a>
                            , or check out some great posts.
                        </p>
                        <ul className="NotFound__menu">
                            <li>
                                <a href="/created">new posts</a>
                            </li>
                            <li>
                                <a href="/hot">hot posts</a>
                            </li>
                            <li>
                                <a href="/trending">trending posts</a>
                            </li>
                            <li>
                                <a href="/promoted">promoted posts</a>
                            </li>
                            <li>
                                <a href="/active">active posts</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: '*',
    component: NotFound,
};
