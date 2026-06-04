package com.cms.folder;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FolderMapper extends BaseMapper<Folder> {
    List<Folder> selectRootFolders();
    List<Folder> selectChildren(@Param("folderCode") String folderCode);
    Folder selectByCode(@Param("folderCode") String folderCode);
    Integer selectNextSort(@Param("parentFolderCode") String parentFolderCode);
    int countActiveChildren(@Param("folderCode") String folderCode);
}
