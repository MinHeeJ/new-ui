package com.cms.folder;

import com.cms.common.Result;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping("/root")
    public Result<List<Folder>> getRootFolders() {
        return Result.ok(folderService.getRootFolders());
    }

    @GetMapping("/{folderCode}/children")
    public Result<FolderTreeVO> getChildren(@PathVariable String folderCode, @RequestParam(defaultValue = "false") boolean portalMode) {
        return Result.ok(folderService.getChildren(folderCode, portalMode));
    }

    @PostMapping
    public Result<Folder> create(@Valid @RequestBody FolderCreateDTO dto) {
        return Result.ok(folderService.create(dto));
    }

    @PutMapping("/{folderCode}")
    public Result<Folder> update(@PathVariable String folderCode, @Valid @RequestBody FolderUpdateDTO dto) {
        return Result.ok(folderService.update(folderCode, dto));
    }

    @DeleteMapping("/{folderCode}")
    public Result<Void> delete(@PathVariable String folderCode) {
        folderService.delete(folderCode);
        return Result.ok();
    }
}
