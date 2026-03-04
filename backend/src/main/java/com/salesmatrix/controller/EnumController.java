package com.salesmatrix.controller;

import com.salesmatrix.enums.*;
import com.salesmatrix.service.EnumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @Autowired
    private EnumService enumService;

    @GetMapping("/brands")
    public ResponseEntity<List<Map<String, Object>>> getBrands(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllBrands(storeId));
    }

    @PostMapping("/brands")
    public ResponseEntity<Map<String, Object>> createBrand(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        if (name == null || name.trim().isEmpty()) {
            name = (String) request.get("displayName");
        }
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> brand = enumService.createBrand(name, storeId);
            return ResponseEntity.ok(brand);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ram-sizes")
    public ResponseEntity<List<Map<String, Object>>> getRamSizes(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllRamSizes(storeId));
    }

    @PostMapping("/ram-sizes")
    public ResponseEntity<Map<String, Object>> createRamSize(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> ramSize = enumService.createRamSize(name, storeId);
            return ResponseEntity.ok(ramSize);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/storage-sizes")
    public ResponseEntity<List<Map<String, Object>>> getStorageSizes(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllStorageSizes(storeId));
    }

    @PostMapping("/storage-sizes")
    public ResponseEntity<Map<String, Object>> createStorageSize(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> storageSize = enumService.createStorageSize(name, storeId);
            return ResponseEntity.ok(storageSize);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/source-types")
    public ResponseEntity<List<Map<String, String>>> getSourceTypes() {
        List<Map<String, String>> sourceTypes = java.util.Arrays.stream(SourceType.values())
                .map(source -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("name", source.name());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(sourceTypes);
    }

    @GetMapping("/product-statuses")
    public ResponseEntity<List<Map<String, String>>> getProductStatuses() {
        List<Map<String, String>> statuses = java.util.Arrays.stream(ProductStatus.values())
                .map(status -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("name", status.name());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/product-conditions")
    public ResponseEntity<List<Map<String, String>>> getProductConditions() {
        List<Map<String, String>> conditions = java.util.Arrays.stream(ProductCondition.values())
                .map(condition -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("name", condition.name());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(conditions);
    }

    @GetMapping("/return-statuses")
    public ResponseEntity<List<Map<String, String>>> getReturnStatuses() {
        List<Map<String, String>> statuses = java.util.Arrays.stream(ReturnStatus.values())
                .map(status -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("name", status.name());
                    map.put("description", status.getDescription());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/models")
    public ResponseEntity<List<Map<String, Object>>> getModels(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllModels(storeId));
    }

    @PostMapping("/models")
    public ResponseEntity<Map<String, Object>> createModel(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> model = enumService.createModel(name, storeId);
            return ResponseEntity.ok(model);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/colors")
    public ResponseEntity<List<Map<String, Object>>> getColors(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllColors(storeId));
    }

    @PostMapping("/colors")
    public ResponseEntity<Map<String, Object>> createColor(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> color = enumService.createColor(name, storeId);
            return ResponseEntity.ok(color);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/screen-sizes")
    public ResponseEntity<List<Map<String, Object>>> getScreenSizes(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllScreenSizes(storeId));
    }

    @PostMapping("/screen-sizes")
    public ResponseEntity<Map<String, Object>> createScreenSize(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> screenSize = enumService.createScreenSize(name, storeId);
            return ResponseEntity.ok(screenSize);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/resolutions")
    public ResponseEntity<List<Map<String, Object>>> getResolutions(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllResolutions(storeId));
    }

    @PostMapping("/resolutions")
    public ResponseEntity<Map<String, Object>> createResolution(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> resolution = enumService.createResolution(name, storeId);
            return ResponseEntity.ok(resolution);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tv-types")
    public ResponseEntity<List<Map<String, Object>>> getTVTypes(@RequestParam Long storeId) {
        return ResponseEntity.ok(enumService.getAllTVTypes(storeId));
    }

    @PostMapping("/tv-types")
    public ResponseEntity<Map<String, Object>> createTVType(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long storeId = ((Number) request.get("storeId")).longValue();
        try {
            Map<String, Object> tvType = enumService.createTVType(name, storeId);
            return ResponseEntity.ok(tvType);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
