package com.cms.article;

import java.util.List;

public interface ArticleService {
    ArticleVO getDetail(String articleCode);
    ArticleVO create(ArticleCreateDTO dto);
    ArticleVO update(String articleCode, ArticleUpdateDTO dto);
    void delete(String articleCode);
    ArticleVO publish(String articleCode);
    ArticleVO offline(String articleCode);
    List<ArticleVO> search(String keyword, boolean portalMode);
}
