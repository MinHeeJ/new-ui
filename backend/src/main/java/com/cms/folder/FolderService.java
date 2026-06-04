package com.cms.folder;

import java.util.List;

public interface FolderService {
    List<Folder> getRootFolders();
    FolderTreeVO getChildren(String folderCode, boolean portalMode);
    Folder create(FolderCreateDTO dto);
    Folder update(String folderCode, FolderUpdateDTO dto);
    void delete(String folderCode);
}
