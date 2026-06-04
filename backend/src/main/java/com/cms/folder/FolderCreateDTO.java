package com.cms.folder;

import jakarta.validation.constraints.NotBlank;

public class FolderCreateDTO {
    private String parentFolderCode;
    @NotBlank(message = "title is required")
    private String title;
    private String description;

    public String getParentFolderCode() { return parentFolderCode; }
    public void setParentFolderCode(String parentFolderCode) { this.parentFolderCode = parentFolderCode; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
