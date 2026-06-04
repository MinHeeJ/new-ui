package com.cms.folder;

import com.cms.article.ArticleMapper;
import com.cms.article.ArticleVO;
import com.cms.common.BusinessException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FolderServiceImplTest {
    @Mock
    FolderMapper folderMapper;

    @Mock
    ArticleMapper articleMapper;

    @InjectMocks
    FolderServiceImpl folderService;

    @Test
    void getRootFolders_delegatesToMapperQueryForParentMinusOneActiveAndNotDeletedRoots() {
        Folder root = folder("F_ROOT", "-1", "Root", true);
        when(folderMapper.selectRootFolders()).thenReturn(List.of(root));

        List<Folder> result = folderService.getRootFolders();

        assertThat(result).containsExactly(root);
        verify(folderMapper).selectRootFolders();
    }

    @Test
    void getChildren_returnsChildFoldersAndArticles_usingPortalMode() {
        Folder child = folder("F_CHILD", "F_ROOT", "Child", true);
        ArticleVO article = new ArticleVO();
        article.setArticleCode("A1");
        article.setTitle("Article");

        when(folderMapper.selectChildren("F_ROOT")).thenReturn(List.of(child));
        when(articleMapper.selectByFolderCode("F_ROOT", true)).thenReturn(List.of(article));

        FolderTreeVO result = folderService.getChildren("F_ROOT", true);

        assertThat(result.getFolders()).containsExactly(child);
        assertThat(result.getArticles()).containsExactly(article);
        verify(articleMapper).selectByFolderCode("F_ROOT", true);
    }

    @Test
    void create_setsRootParentActiveTrueNextSortAndGeneratedFolderCode() {
        FolderCreateDTO dto = new FolderCreateDTO();
        dto.setTitle("New Root");
        dto.setDescription("desc");

        when(folderMapper.selectNextSort("-1")).thenReturn(3);
        when(folderMapper.selectByCode(org.mockito.ArgumentMatchers.startsWith("FOLDER_")))
                .thenAnswer(invocation -> folder(invocation.getArgument(0), "-1", "New Root", true));

        Folder result = folderService.create(dto);

        ArgumentCaptor<Folder> captor = ArgumentCaptor.forClass(Folder.class);
        verify(folderMapper).insert(captor.capture());
        Folder inserted = captor.getValue();

        assertThat(inserted.getFolderCode()).startsWith("FOLDER_");
        assertThat(inserted.getParentFolderCode()).isEqualTo("-1");
        assertThat(inserted.getTitle()).isEqualTo("New Root");
        assertThat(inserted.getActive()).isTrue();
        assertThat(inserted.getSort()).isEqualTo(3);
        assertThat(result.getFolderCode()).startsWith("FOLDER_");
    }

    @Test
    void create_throwsBadRequest_whenParentFolderIsInactive() {
        FolderCreateDTO dto = new FolderCreateDTO();
        dto.setParentFolderCode("F_PARENT");
        dto.setTitle("Child");
        when(folderMapper.selectByCode("F_PARENT")).thenReturn(folder("F_PARENT", "-1", "Parent", false));

        assertThatThrownBy(() -> folderService.create(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Parent folder is not active");
    }

    @Test
    void update_changesTitleDescriptionAndActive_whenFolderExists() {
        Folder existing = folder("F1", "-1", "Old", true);
        existing.setId(10L);
        FolderUpdateDTO dto = new FolderUpdateDTO();
        dto.setTitle("Updated");
        dto.setDescription("changed");
        dto.setActive(false);

        when(folderMapper.selectByCode("F1")).thenReturn(existing, existing);

        Folder result = folderService.update("F1", dto);

        assertThat(existing.getTitle()).isEqualTo("Updated");
        assertThat(existing.getDescription()).isEqualTo("changed");
        assertThat(existing.getActive()).isFalse();
        verify(folderMapper).updateById(existing);
        assertThat(result).isSameAs(existing);
    }

    @Test
    void delete_throwsBadRequest_whenActiveChildOrArticleExists() {
        Folder existing = folder("F1", "-1", "Folder", true);
        when(folderMapper.selectByCode("F1")).thenReturn(existing);
        when(folderMapper.countActiveChildren("F1")).thenReturn(1);

        assertThatThrownBy(() -> folderService.delete("F1"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Cannot delete folder with active children or articles");
    }

    @Test
    void delete_logicallyDeletesFolder_whenNoChildOrArticleExists() {
        Folder existing = folder("F1", "-1", "Folder", true);
        existing.setId(10L);
        when(folderMapper.selectByCode("F1")).thenReturn(existing);
        when(folderMapper.countActiveChildren("F1")).thenReturn(0);
        when(articleMapper.countByFolderCode("F1")).thenReturn(0);

        folderService.delete("F1");

        verify(folderMapper).deleteById(10L);
    }

    private Folder folder(String code, String parentCode, String title, boolean active) {
        Folder folder = new Folder();
        folder.setFolderCode(code);
        folder.setParentFolderCode(parentCode);
        folder.setTitle(title);
        folder.setActive(active);
        return folder;
    }
}
