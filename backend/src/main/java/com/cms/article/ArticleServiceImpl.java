package com.cms.article;

import com.cms.common.BusinessException;
import com.cms.folder.Folder;
import com.cms.folder.FolderMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ArticleServiceImpl implements ArticleService {
    private final ArticleMapper articleMapper;
    private final FolderMapper folderMapper;

    public ArticleServiceImpl(ArticleMapper articleMapper, FolderMapper folderMapper) {
        this.articleMapper = articleMapper;
        this.folderMapper = folderMapper;
    }

    @Override
    public ArticleVO getDetail(String articleCode) {
        ArticleVO article = articleMapper.selectByCode(articleCode);
        if (article == null) {
            throw new BusinessException(404, "Article not found");
        }
        return article;
    }

    @Override
    @Transactional
    public ArticleVO create(ArticleCreateDTO dto) {
        validateActiveFolder(dto.getFolderCode());
        Article article = new Article();
        article.setArticleCode("ARTICLE_" + UUID.randomUUID().toString().replace("-", "").toUpperCase());
        article.setFolderCode(dto.getFolderCode());
        article.setTitle(dto.getTitle());
        article.setContentMd(dto.getContentMd());
        article.setStatus(ArticleStatus.DRAFT);
        article.setPublishedAt(null);
        articleMapper.insert(article);
        return getDetail(article.getArticleCode());
    }

    @Override
    @Transactional
    public ArticleVO update(String articleCode, ArticleUpdateDTO dto) {
        validateActiveFolder(dto.getFolderCode());
        ArticleVO currentVo = getDetail(articleCode);
        Article article = new Article();
        article.setId(findId(articleCode));
        article.setArticleCode(articleCode);
        article.setFolderCode(dto.getFolderCode());
        article.setTitle(dto.getTitle());
        article.setContentMd(dto.getContentMd());
        article.setStatus(currentVo.getStatus() == ArticleStatus.PUBLISHED ? ArticleStatus.DRAFT : currentVo.getStatus());
        article.setPublishedAt(currentVo.getStatus() == ArticleStatus.PUBLISHED ? null : currentVo.getPublishedAt());
        articleMapper.updateById(article);
        return getDetail(articleCode);
    }

    @Override
    @Transactional
    public void delete(String articleCode) {
        getDetail(articleCode);
        articleMapper.logicalDeleteByCode(articleCode);
    }

    @Override
    @Transactional
    public ArticleVO publish(String articleCode) {
        ArticleVO current = getDetail(articleCode);
        if (current.getStatus() == ArticleStatus.PUBLISHED) {
            throw new BusinessException(400, "Already published article cannot be published again");
        }
        if (current.getStatus() != ArticleStatus.DRAFT) {
            throw new BusinessException(400, "Only DRAFT article can be published");
        }
        Article article = new Article();
        article.setId(findId(articleCode));
        article.setStatus(ArticleStatus.PUBLISHED);
        article.setPublishedAt(LocalDateTime.now());
        articleMapper.updateById(article);
        return getDetail(articleCode);
    }

    @Override
    @Transactional
    public ArticleVO offline(String articleCode) {
        ArticleVO current = getDetail(articleCode);
        if (current.getStatus() != ArticleStatus.PUBLISHED) {
            throw new BusinessException(400, "Only PUBLISHED article can be offline");
        }
        Article article = new Article();
        article.setId(findId(articleCode));
        article.setStatus(ArticleStatus.OFFLINE);
        article.setPublishedAt(current.getPublishedAt());
        articleMapper.updateById(article);
        return getDetail(articleCode);
    }

    @Override
    public List<ArticleVO> search(String keyword, boolean portalMode) {
        if (keyword != null && keyword.length() < 2) {
            return Collections.emptyList();
        }
        return articleMapper.search(keyword, portalMode);
    }

    private void validateActiveFolder(String folderCode) {
        Folder folder = folderMapper.selectByCode(folderCode);
        if (folder == null || !Boolean.TRUE.equals(folder.getActive())) {
            throw new BusinessException(400, "Folder is not active");
        }
    }

    private Long findId(String articleCode) {
        ArticleVO vo = articleMapper.selectByCode(articleCode);
        if (vo == null) {
            throw new BusinessException(404, "Article not found");
        }
        Article probe = new Article();
        probe.setArticleCode(articleCode);
        Article db = articleMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Article>()
                .eq("article_code", articleCode).eq("del_flag", false));
        if (db == null) {
            throw new BusinessException(404, "Article not found");
        }
        return db.getId();
    }
}
