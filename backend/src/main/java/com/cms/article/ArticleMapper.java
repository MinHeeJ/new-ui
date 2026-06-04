package com.cms.article;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    ArticleVO selectByCode(@Param("articleCode") String articleCode);
    List<ArticleVO> selectByFolderCode(@Param("folderCode") String folderCode, @Param("portalMode") boolean portalMode);
    List<ArticleVO> search(@Param("keyword") String keyword, @Param("portalMode") boolean portalMode);
    int countByFolderCode(@Param("folderCode") String folderCode);
    int logicalDeleteByCode(@Param("articleCode") String articleCode);
}
