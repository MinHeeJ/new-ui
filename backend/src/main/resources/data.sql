INSERT INTO cms_user (username, password, role, created_by, updated_by, del_flag)
VALUES ('admin', '$2a$10$16cmmbvTocQbLNQ1EJD0Rem1UTQBcnW3Wv2YvjR0VGzAgTbmkmMhO', 'ADMIN', 'system', 'system', FALSE)
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = 'system',
    del_flag = FALSE;

INSERT INTO cms_folder (folder_code, parent_folder_code, title, description, active, sort, created_by, updated_by, del_flag)
VALUES
    ('FOLDER_NOTICE', '-1', '공지사항', '서비스 공지와 업데이트 안내', TRUE, 10, 'system', 'system', FALSE),
    ('FOLDER_GUIDE', '-1', '가이드', 'CMS 사용 가이드와 운영 문서', TRUE, 20, 'system', 'system', FALSE),
    ('FOLDER_NEWS', '-1', '뉴스', '프로덕트 뉴스와 릴리즈 노트', TRUE, 30, 'system', 'system', FALSE)
ON CONFLICT (folder_code) DO UPDATE SET
    parent_folder_code = EXCLUDED.parent_folder_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    active = EXCLUDED.active,
    sort = EXCLUDED.sort,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = 'system',
    del_flag = FALSE;

INSERT INTO cms_article (article_code, folder_code, title, content_md, status, published_at, created_by, updated_by, del_flag)
VALUES
    ('ARTICLE_WELCOME', 'FOLDER_NOTICE', 'CMS에 오신 것을 환영합니다', '# CMS에 오신 것을 환영합니다

폴더 기반 콘텐츠 관리 시스템의 샘플 게시글입니다.', 'PUBLISHED', CURRENT_TIMESTAMP, 'system', 'system', FALSE),
    ('ARTICLE_EDITOR_GUIDE', 'FOLDER_GUIDE', 'Markdown 에디터 사용법', '# Markdown 에디터 사용법

- 제목과 본문을 입력합니다.
- Draft로 저장한 뒤 발행할 수 있습니다.', 'DRAFT', NULL, 'system', 'system', FALSE),
    ('ARTICLE_RELEASE_NOTE', 'FOLDER_NEWS', 'MVP 릴리즈 노트', '# MVP 릴리즈 노트

CMS MVP는 게시글, 폴더, 포털 탐색을 제공합니다.', 'OFFLINE', NULL, 'system', 'system', FALSE)
ON CONFLICT (article_code) DO UPDATE SET
    folder_code = EXCLUDED.folder_code,
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = 'system',
    del_flag = FALSE;
