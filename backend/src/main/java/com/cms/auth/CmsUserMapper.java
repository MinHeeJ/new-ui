package com.cms.auth;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CmsUserMapper extends BaseMapper<CmsUser> {
    @Select("SELECT * FROM cms_user WHERE username = #{username} AND del_flag = false LIMIT 1")
    CmsUser selectByUsername(@Param("username") String username);
}
