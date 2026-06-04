package com.cms.folder;

import jakarta.validation.constraints.NotBlank;

public class FolderUpdateDTO {
    @NotBlank(message = "title is required")
    private String title;
    private String description;
    private Boolean active;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
