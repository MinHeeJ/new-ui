package com.cms.article;

import jakarta.validation.constraints.NotBlank;

public class ArticleCreateDTO {
    @NotBlank(message = "folderCode is required")
    private String folderCode;
    @NotBlank(message = "title is required")
    private String title;
    @NotBlank(message = "contentMd is required")
    private String contentMd;

    public String getFolderCode() { return folderCode; }
    public void setFolderCode(String folderCode) { this.folderCode = folderCode; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContentMd() { return contentMd; }
    public void setContentMd(String contentMd) { this.contentMd = contentMd; }
}
