CREATE TABLE IF NOT EXISTS cms_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'ADMIN',
    created_by VARCHAR(64) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(64) NOT NULL DEFAULT 'system',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    del_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cms_folder (
    id BIGSERIAL PRIMARY KEY,
    folder_code VARCHAR(64) NOT NULL UNIQUE,
    parent_folder_code VARCHAR(64) NOT NULL DEFAULT '-1',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort INTEGER NOT NULL DEFAULT 0,
    created_by VARCHAR(64) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(64) NOT NULL DEFAULT 'system',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    del_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cms_article (
    id BIGSERIAL PRIMARY KEY,
    article_code VARCHAR(64) NOT NULL UNIQUE,
    folder_code VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_md TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP NULL,
    created_by VARCHAR(64) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(64) NOT NULL DEFAULT 'system',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    del_flag BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_cms_article_folder FOREIGN KEY (folder_code) REFERENCES cms_folder(folder_code),
    CONSTRAINT chk_cms_article_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'OFFLINE'))
);

CREATE INDEX IF NOT EXISTS idx_cms_user_username ON cms_user(username) WHERE del_flag = FALSE;
CREATE INDEX IF NOT EXISTS idx_cms_folder_parent ON cms_folder(parent_folder_code, active, sort) WHERE del_flag = FALSE;
CREATE INDEX IF NOT EXISTS idx_cms_article_folder ON cms_article(folder_code, status, updated_at DESC) WHERE del_flag = FALSE;
CREATE INDEX IF NOT EXISTS idx_cms_article_search ON cms_article(title, status) WHERE del_flag = FALSE;
