package com.cms.article;

import com.cms.common.Result;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("/api/articles/{articleCode}")
    public Result<ArticleVO> getDetail(@PathVariable String articleCode) {
        return Result.ok(articleService.getDetail(articleCode));
    }

    @PostMapping("/api/articles")
    public Result<ArticleVO> create(@Valid @RequestBody ArticleCreateDTO dto) {
        return Result.ok(articleService.create(dto));
    }

    @PutMapping("/api/articles/{articleCode}")
    public Result<ArticleVO> update(@PathVariable String articleCode, @Valid @RequestBody ArticleUpdateDTO dto) {
        return Result.ok(articleService.update(articleCode, dto));
    }

    @DeleteMapping("/api/articles/{articleCode}")
    public Result<Void> delete(@PathVariable String articleCode) {
        articleService.delete(articleCode);
        return Result.ok();
    }

    @PutMapping("/api/articles/{articleCode}/publish")
    public Result<ArticleVO> publish(@PathVariable String articleCode) {
        return Result.ok(articleService.publish(articleCode));
    }

    @PutMapping("/api/articles/{articleCode}/offline")
    public Result<ArticleVO> offline(@PathVariable String articleCode) {
        return Result.ok(articleService.offline(articleCode));
    }

    @GetMapping("/api/search")
    public Result<List<ArticleVO>> search(@RequestParam(required = false) String keyword, @RequestParam(defaultValue = "false") boolean portalMode) {
        return Result.ok(articleService.search(keyword, portalMode));
    }
}
