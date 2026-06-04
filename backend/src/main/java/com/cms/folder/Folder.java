package com.cms.folder;

import com.baomidou.mybatisplus.annotation.TableName;
import com.cms.common.BaseEntity;

@TableName("cms_folder")
public class Folder extends BaseEntity {
    private String folderCode;
    private String parentFolderCode;
    private String title;
    private String description;
    private Boolean active;
    private Integer sort;

    public String getFolderCode() { return folderCode; }
    public void setFolderCode(String folderCode) { this.folderCode = folderCode; }
    public String getParentFolderCode() { return parentFolderCode; }
    public void setParentFolderCode(String parentFolderCode) { this.parentFolderCode = parentFolderCode; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Integer getSort() { return sort; }
    public void setSort(Integer sort) { this.sort = sort; }
}
