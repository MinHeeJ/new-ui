package com.cms.folder;

import com.cms.article.ArticleVO;
import com.cms.common.GlobalExceptionHandler;
import com.cms.support.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FolderController.class)
@Import({GlobalExceptionHandler.class, TestSecurityConfig.class})
class FolderControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    FolderService folderService;

    @Test
    void getRootFolders_returnsActiveRootFolders() throws Exception {
        Folder root = folder("F_ROOT", "Root", true);
        when(folderService.getRootFolders()).thenReturn(List.of(root));

        mockMvc.perform(get("/api/folders/root"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].folderCode").value("F_ROOT"))
                .andExpect(jsonPath("$.data[0].title").value("Root"));
    }

    @Test
    void getChildren_returnsFoldersAndArticles_withPortalMode() throws Exception {
        ArticleVO article = new ArticleVO();
        article.setArticleCode("A1");
        article.setTitle("Published article");

        when(folderService.getChildren("F_ROOT", true))
                .thenReturn(new FolderTreeVO(List.of(folder("F_CHILD", "Child", true)), List.of(article)));

        mockMvc.perform(get("/api/folders/F_ROOT/children").param("portalMode", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.folders[0].folderCode").value("F_CHILD"))
                .andExpect(jsonPath("$.data.articles[0].articleCode").value("A1"));

        verify(folderService).getChildren("F_ROOT", true);
    }

    @Test
    @WithMockUser
    void create_returnsCreatedFolder_whenRequestIsValidAndAuthenticated() throws Exception {
        when(folderService.create(any(FolderCreateDTO.class))).thenReturn(folder("F_NEW", "New Folder", true));

        mockMvc.perform(post("/api/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"parentFolderCode\":\"-1\",\"title\":\"New Folder\",\"description\":\"desc\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.folderCode").value("F_NEW"))
                .andExpect(jsonPath("$.data.active").value(true));
    }

    @Test
    @WithMockUser
    void create_returnsBadRequest_whenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/api/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"parentFolderCode\":\"-1\",\"title\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void create_returnsUnauthorized_whenAuthenticationIsMissing() throws Exception {
        mockMvc.perform(post("/api/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New Folder\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @WithMockUser
    void update_returnsUpdatedFolder_whenRequestIsValidAndAuthenticated() throws Exception {
        when(folderService.update(any(), any(FolderUpdateDTO.class))).thenReturn(folder("F1", "Updated", false));

        mockMvc.perform(put("/api/folders/F1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Updated\",\"description\":\"changed\",\"active\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated"))
                .andExpect(jsonPath("$.data.active").value(false));
    }

    @Test
    void update_returnsUnauthorized_whenAuthenticationIsMissing() throws Exception {
        mockMvc.perform(put("/api/folders/F1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Updated\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void delete_returnsOk_whenAuthenticated() throws Exception {
        mockMvc.perform(delete("/api/folders/F1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        verify(folderService).delete("F1");
    }

    @Test
    @WithMockUser
    void delete_returnsBadRequest_whenFolderHasChildrenOrArticles() throws Exception {
        doThrow(new com.cms.common.BusinessException(400, "Cannot delete folder with active children or articles"))
                .when(folderService).delete("F1");

        mockMvc.perform(delete("/api/folders/F1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    private Folder folder(String code, String title, boolean active) {
        Folder folder = new Folder();
        folder.setFolderCode(code);
        folder.setTitle(title);
        folder.setActive(active);
        return folder;
    }
}
