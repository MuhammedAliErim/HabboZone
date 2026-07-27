-- Performance indexes for commonly queried columns

-- News
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_author_id ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_status_published_at ON news(status, published_at DESC);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_habbo_username ON profiles(habbo_username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Forum
CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);
CREATE INDEX IF NOT EXISTS idx_topics_forum_id ON topics(forum_id);
CREATE INDEX IF NOT EXISTS idx_topics_author_id ON topics(author_id);
CREATE INDEX IF NOT EXISTS idx_topics_pinned_created ON topics(is_pinned, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_topic_id ON replies(topic_id);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_news_id ON comments(news_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

-- Likes (polymorphic)
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_target ON likes(user_id, target_type, target_id);

-- Magazines
CREATE INDEX IF NOT EXISTS idx_magazines_issue_number ON magazines(issue_number DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_published_at ON magazines(published_at);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_event_time ON events(event_time);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);

-- Badges
CREATE INDEX IF NOT EXISTS idx_badges_code ON badges(code);

-- Tags
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Gallery
CREATE INDEX IF NOT EXISTS idx_gallery_is_approved ON gallery(is_approved);

-- Market items
CREATE INDEX IF NOT EXISTS idx_habbo_items_slug ON habbo_items(slug);
CREATE INDEX IF NOT EXISTS idx_habbo_items_category_id ON habbo_items(category_id);
CREATE INDEX IF NOT EXISTS idx_habbo_item_values_item_id ON habbo_item_values(item_id);

-- Guides
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);

-- User badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Follows
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
