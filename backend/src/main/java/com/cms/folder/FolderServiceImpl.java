package com.cms.folder;

import com.cms.article.ArticleMapper;
import com.cms.article.ArticleVO;
import com.cms.common.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FolderServiceImpl implements FolderService {
    private final FolderMapper folderMapper;
    private final ArticleMapper articleMapper;

    public FolderServiceImpl(FolderMapper folderMapper, ArticleMapper articleMapper) {
        this.folderMapper = folderMapper;
        this.articleMapper = articleMapper;
    }

    @Override
    public List<Folder> getRootFolders() {
        return folderMapper.selectRootFolders();
    }

    @Override
    public FolderTreeVO getChildren(String folderCode, boolean portalMode) {
        List<Folder> folders = folderMapper.selectChildren(folderCode);
        List<ArticleVO> articles = articleMapper.selectByFolderCode(folderCode, portalMode);
        return new FolderTreeVO(folders, articles);
    }

    @Override
    @Transactional
    public Folder create(FolderCreateDTO dto) {
        String parentCode = dto.getParentFolderCode();
        if (parentCode == null || parentCode.isBlank()) {
            parentCode = "-1";
        }
        if (!"-1".equals(parentCode)) {
            Folder parent = folderMapper.selectByCode(parentCode);
            if (parent == null || !Boolean.TRUE.equals(parent.getActive())) {
                throw new BusinessException(400, "Parent folder is not active");
            }
        }
        Folder folder = new Folder();
        folder.setFolderCode("FOLDER_" + UUID.randomUUID().toString().replace("-", "").toUpperCase());
        folder.setParentFolderCode(parentCode);
        folder.setTitle(dto.getTitle());
        folder.setDescription(dto.getDescription());
        folder.setActive(true);
        folder.setSort(folderMapper.selectNextSort(parentCode));
        folderMapper.insert(folder);
        return folderMapper.selectByCode(folder.getFolderCode());
    }

    @Override
    @Transactional
    public Folder update(String folderCode, FolderUpdateDTO dto) {
        Folder folder = folderMapper.selectByCode(folderCode);
        if (folder == null) {
            throw new BusinessException(404, "Folder not found");
        }
        folder.setTitle(dto.getTitle());
        folder.setDescription(dto.getDescription());
        if (dto.getActive() != null) {
            folder.setActive(dto.getActive());
        }
        folderMapper.updateById(folder);
        return folderMapper.selectByCode(folderCode);
    }

    @Override
    @Transactional
    public void delete(String folderCode) {
        Folder folder = folderMapper.selectByCode(folderCode);
        if (folder == null) {
            throw new BusinessException(404, "Folder not found");
        }
        if (folderMapper.countActiveChildren(folderCode) > 0 || articleMapper.countByFolderCode(folderCode) > 0) {
            throw new BusinessException(400, "Cannot delete folder with active children or articles");
        }
        folderMapper.deleteById(folder.getId());
    }
}
