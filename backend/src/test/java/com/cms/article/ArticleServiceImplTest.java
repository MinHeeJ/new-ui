package com.cms.article;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.cms.common.BusinessException;
import com.cms.folder.Folder;
import com.cms.folder.FolderMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArticleServiceImplTest {
    @Mock
    ArticleMapper articleMapper;

    @Mock
    FolderMapper folderMapper;

    @InjectMocks
    ArticleServiceImpl articleService;

    @Test
    void create_setsStatusDraftPublishedAtNullAndGeneratedArticleCode() {
        ArticleCreateDTO dto = new ArticleCreateDTO();
        dto.setFolderCode("F1");
        dto.setTitle("Draft title");
        dto.setContentMd("# body");

        when(folderMapper.selectByCode("F1")).thenReturn(activeFolder("F1"));
        when(articleMapper.selectByCode(startsWith("ARTICLE_")))
                .thenAnswer(invocation -> articleVo(invocation.getArgument(0), "F1", "Folder", "Draft title", ArticleStatus.DRAFT, null));

        ArticleVO result = articleService.create(dto);

        ArgumentCaptor<Article> captor = ArgumentCaptor.forClass(Article.class);
        verify(articleMapper).insert(captor.capture());
        Article inserted = captor.getValue();

        assertThat(inserted.getArticleCode()).startsWith("ARTICLE_");
        assertThat(inserted.getFolderCode()).isEqualTo("F1");
        assertThat(inserted.getStatus()).isEqualTo(ArticleStatus.DRAFT);
        assertThat(inserted.getPublishedAt()).isNull();
        assertThat(result.getArticleCode()).startsWith("ARTICLE_");
        assertThat(result.getStatus()).isEqualTo(ArticleStatus.DRAFT);
    }

    @Test
    void create_throwsBadRequest_whenFolderIsInactive() {
        ArticleCreateDTO dto = new ArticleCreateDTO();
        dto.setFolderCode("F1");
        dto.setTitle("Title");
        dto.setContentMd("content");

        Folder inactive = activeFolder("F1");
        inactive.setActive(false);
        when(folderMapper.selectByCode("F1")).thenReturn(inactive);

        assertThatThrownBy(() -> articleService.create(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Folder is not active");
    }

    @Test
    void getDetail_returnsArticleVoIncludingFolderTitle() {
        ArticleVO vo = articleVo("A1", "F1", "Folder title", "Title", ArticleStatus.PUBLISHED, LocalDateTime.now());
        when(articleMapper.selectByCode("A1")).thenReturn(vo);

        ArticleVO result = articleService.getDetail("A1");

        assertThat(result.getArticleCode()).isEqualTo("A1");
        assertThat(result.getFolderTitle()).isEqualTo("Folder title");
    }

    @Test
    void getDetail_throwsNotFound_whenArticleDoesNotExist() {
        when(articleMapper.selectByCode("MISSING")).thenReturn(null);

        assertThatThrownBy(() -> articleService.getDetail("MISSING"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Article not found");
    }

    @Test
    void update_convertsPublishedArticleBackToDraftAndClearsPublishedAt() {
        ArticleUpdateDTO dto = new ArticleUpdateDTO();
        dto.setFolderCode("F2");
        dto.setTitle("Updated");
        dto.setContentMd("changed");

        ArticleVO current = articleVo("A1", "F1", "Folder", "Old", ArticleStatus.PUBLISHED, LocalDateTime.now());
        ArticleVO updated = articleVo("A1", "F2", "Folder2", "Updated", ArticleStatus.DRAFT, null);
        Article db = new Article();
        db.setId(99L);
        db.setArticleCode("A1");

        when(folderMapper.selectByCode("F2")).thenReturn(activeFolder("F2"));
        when(articleMapper.selectByCode("A1")).thenReturn(current, current, updated);
        when(articleMapper.selectOne(any(Wrapper.class))).thenReturn(db);

        ArticleVO result = articleService.update("A1", dto);

        ArgumentCaptor<Article> captor = ArgumentCaptor.forClass(Article.class);
        verify(articleMapper).updateById(captor.capture());
        Article saved = captor.getValue();

        assertThat(saved.getId()).isEqualTo(99L);
        assertThat(saved.getStatus()).isEqualTo(ArticleStatus.DRAFT);
        assertThat(saved.getPublishedAt()).isNull();
        assertThat(result.getStatus()).isEqualTo(ArticleStatus.DRAFT);
        assertThat(result.getPublishedAt()).isNull();
    }

    @Test
    void publish_setsPublishedStatusAndPublishedAtForDraftArticle() {
        ArticleVO current = articleVo("A1", "F1", "Folder", "Title", ArticleStatus.DRAFT, null);
        ArticleVO published = articleVo("A1", "F1", "Folder", "Title", ArticleStatus.PUBLISHED, LocalDateTime.now());
        Article db = new Article();
        db.setId(99L);

        when(articleMapper.selectByCode("A1")).thenReturn(current, current, published);
        when(articleMapper.selectOne(any(Wrapper.class))).thenReturn(db);

        ArticleVO result = articleService.publish("A1");

        ArgumentCaptor<Article> captor = ArgumentCaptor.forClass(Article.class);
        verify(articleMapper).updateById(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(ArticleStatus.PUBLISHED);
        assertThat(captor.getValue().getPublishedAt()).isNotNull();
        assertThat(result.getStatus()).isEqualTo(ArticleStatus.PUBLISHED);
    }

    @Test
    void offline_rejectsDraftArticle() {
        when(articleMapper.selectByCode("A1")).thenReturn(articleVo("A1", "F1", "Folder", "Title", ArticleStatus.DRAFT, null));

        assertThatThrownBy(() -> articleService.offline("A1"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Only PUBLISHED article can be offline");
    }

    @Test
    void delete_logicallyDeletesArticleByCode() {
        when(articleMapper.selectByCode("A1")).thenReturn(articleVo("A1", "F1", "Folder", "Title", ArticleStatus.DRAFT, null));

        articleService.delete("A1");

        verify(articleMapper).logicalDeleteByCode("A1");
    }

    @Test
    void search_returnsEmptyList_whenKeywordLengthIsLessThanTwo() {
        List<ArticleVO> result = articleService.search("a", true);

        assertThat(result).isEmpty();
    }

    private Folder activeFolder(String code) {
        Folder folder = new Folder();
        folder.setFolderCode(code);
        folder.setTitle("Folder");
        folder.setActive(true);
        return folder;
    }

    private ArticleVO articleVo(String code, String folderCode, String folderTitle, String title,
                                ArticleStatus status, LocalDateTime publishedAt) {
        ArticleVO vo = new ArticleVO();
        vo.setArticleCode(code);
        vo.setFolderCode(folderCode);
        vo.setFolderTitle(folderTitle);
        vo.setTitle(title);
        vo.setContentMd("content");
        vo.setStatus(status);
        vo.setPublishedAt(publishedAt);
        return vo;
    }
}
