import React from 'react';
import { connect } from 'react-redux';
import PostSummary from '../cards/PostSummary';

const FeedPage = ({ content, discussionIdx }) => {
    const created = discussionIdx.getIn(['created', ''], List());
    if (!created.size) return <div>No posts found.</div>;

    const posts = created.map(key => content.get(key)).filter(Boolean);

    return (
        <div className="FeedPage">
            {posts.size === 0 && <div>No posts available.</div>}
            {posts.map(post => (
                <PostSummary key={post.get('permlink')} post={post.toJS()} />
            ))}
        </div>
    );
};

const mapStateToProps = (state) => ({
    content: state.global.get('content'),
    discussionIdx: state.global.get('discussion_idx'),
});

export default connect(mapStateToProps)(FeedPage);

