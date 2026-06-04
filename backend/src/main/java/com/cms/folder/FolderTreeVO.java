package com.cms.folder;

import com.cms.article.ArticleVO;
import java.util.List;

public class FolderTreeVO {
    private List<Folder> folders;
    private List<ArticleVO> articles;

    public FolderTreeVO() {}
    public FolderTreeVO(List<Folder> folders, List<ArticleVO> articles) {
        this.folders = folders;
        this.articles = articles;
    }
    public List<Folder> getFolders() { return folders; }
    public void setFolders(List<Folder> folders) { this.folders = folders; }
    public List<ArticleVO> getArticles() { return articles; }
    public void setArticles(List<ArticleVO> articles) { this.articles = articles; }
}
