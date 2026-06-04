package com.cms.article;

import com.cms.common.BusinessException;
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

@WebMvcTest(ArticleController.class)
@Import({GlobalExceptionHandler.class, TestSecurityConfig.class})
class ArticleControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    ArticleService articleService;

    @Test
    void getDetail_returnsArticleWithFolderTitle() throws Exception {
        when(articleService.getDetail("A1")).thenReturn(article("A1", "F1", "Folder", "Title", ArticleStatus.PUBLISHED));

        mockMvc.perform(get("/api/articles/A1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.articleCode").value("A1"))
                .andExpect(jsonPath("$.data.folderTitle").value("Folder"));
    }

    @Test
    void getDetail_returnsNotFound_whenArticleDoesNotExist() throws Exception {
        when(articleService.getDetail("MISSING")).thenThrow(new BusinessException(404, "Article not found"));

        mockMvc.perform(get("/api/articles/MISSING"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @WithMockUser
    void create_returnsDraftArticle_whenRequestIsValidAndAuthenticated() throws Exception {
        when(articleService.create(any(ArticleCreateDTO.class)))
                .thenReturn(article("A_NEW", "F1", "Folder", "Draft title", ArticleStatus.DRAFT));

        mockMvc.perform(post("/api/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"folderCode\":\"F1\",\"title\":\"Draft title\",\"contentMd\":\"# body\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.articleCode").value("A_NEW"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @WithMockUser
    void create_returnsBadRequest_whenRequiredFieldIsBlank() throws Exception {
        mockMvc.perform(post("/api/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"folderCode\":\"F1\",\"title\":\"\",\"contentMd\":\"# body\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void create_returnsUnauthorized_whenAuthenticationIsMissing() throws Exception {
        mockMvc.perform(post("/api/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"folderCode\":\"F1\",\"title\":\"Title\",\"contentMd\":\"# body\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @WithMockUser
    void update_returnsUpdatedArticle_whenAuthenticated() throws Exception {
        when(articleService.update(any(), any(ArticleUpdateDTO.class)))
                .thenReturn(article("A1", "F2", "Folder2", "Updated", ArticleStatus.DRAFT));

        mockMvc.perform(put("/api/articles/A1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"folderCode\":\"F2\",\"title\":\"Updated\",\"contentMd\":\"changed\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    void update_returnsUnauthorized_whenAuthenticationIsMissing() throws Exception {
        mockMvc.perform(put("/api/articles/A1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"folderCode\":\"F2\",\"title\":\"Updated\",\"contentMd\":\"changed\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void delete_returnsOk_whenAuthenticated() throws Exception {
        mockMvc.perform(delete("/api/articles/A1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        verify(articleService).delete("A1");
    }

    @Test
    @WithMockUser
    void delete_returnsNotFound_whenArticleDoesNotExist() throws Exception {
        doThrow(new BusinessException(404, "Article not found")).when(articleService).delete("MISSING");

        mockMvc.perform(delete("/api/articles/MISSING"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @WithMockUser
    void publish_returnsPublishedArticle_whenAuthenticated() throws Exception {
        when(articleService.publish("A1")).thenReturn(article("A1", "F1", "Folder", "Title", ArticleStatus.PUBLISHED));

        mockMvc.perform(put("/api/articles/A1/publish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));
    }

    @Test
    @WithMockUser
    void offline_returnsOfflineArticle_whenAuthenticated() throws Exception {
        when(articleService.offline("A1")).thenReturn(article("A1", "F1", "Folder", "Title", ArticleStatus.OFFLINE));

        mockMvc.perform(put("/api/articles/A1/offline"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("OFFLINE"));
    }

    @Test
    void search_returnsArticles_forPublicPortalModeQuery() throws Exception {
        when(articleService.search("keyword", true)).thenReturn(List.of(article("A1", "F1", "Folder", "Title", ArticleStatus.PUBLISHED)));

        mockMvc.perform(get("/api/search").param("keyword", "keyword").param("portalMode", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].articleCode").value("A1"));
    }

    private ArticleVO article(String code, String folderCode, String folderTitle, String title, ArticleStatus status) {
        ArticleVO article = new ArticleVO();
        article.setArticleCode(code);
        article.setFolderCode(folderCode);
        article.setFolderTitle(folderTitle);
        article.setTitle(title);
        article.setContentMd("content");
        article.setStatus(status);
        return article;
    }
}
