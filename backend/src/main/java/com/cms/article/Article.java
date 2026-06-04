package com.cms.article;

import com.baomidou.mybatisplus.annotation.TableName;
import com.cms.common.BaseEntity;

import java.time.LocalDateTime;

@TableName("cms_article")
public class Article extends BaseEntity {
    private String articleCode;
    private String folderCode;
    private String title;
    private String contentMd;
    private ArticleStatus status;
    private LocalDateTime publishedAt;

    public String getArticleCode() { return articleCode; }
    public void setArticleCode(String articleCode) { this.articleCode = articleCode; }
    public String getFolderCode() { return folderCode; }
    public void setFolderCode(String folderCode) { this.folderCode = folderCode; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContentMd() { return contentMd; }
    public void setContentMd(String contentMd) { this.contentMd = contentMd; }
    public ArticleStatus getStatus() { return status; }
    public void setStatus(ArticleStatus status) { this.status = status; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
