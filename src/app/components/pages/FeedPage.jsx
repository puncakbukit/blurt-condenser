// src/app/components/pages/FeedPage.jsx
import React from 'react';
import { connect } from 'react-redux';
import PostSummary from './PostSummary'; // reuse condenser's PostSummary component

const FeedPage = ({ content, discussionIdx }) => {
    if (!discussionIdx || !discussionIdx.created || !discussionIdx.created['']) {
        return <div>No posts found.</div>;
    }

    const postKeys = discussionIdx.created['']; // array of "author/permlink"
    const posts = postKeys.map((key) => content[key]).filter(Boolean);

    return (
        <div className="FeedPage">
            {posts.length === 0 && <div>No posts available.</div>}
            {posts.map((post) => (
                <PostSummary key={post.permlink} post={post} />
            ))}
        </div>
    );
};

// map Redux state to props
const mapStateToProps = (state) => ({
    content: state.global.get('content').toJS(),
    discussionIdx: state.global.get('discussion_idx').toJS(),
});

export default connect(mapStateToProps)(FeedPage);

