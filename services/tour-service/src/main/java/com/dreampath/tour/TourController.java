package com.dreampath.tour;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tours")
public class TourController {
    private final TourRepository repo;
    private final Path uploadDirectory;

    public TourController(TourRepository repo, @Value("${app.upload.directory:./uploads}") String uploadDirectory) {
        this.repo = repo;
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    @GetMapping public List<TourPackage> all() { return repo.findAllByAvailableTrueOrderByIdAsc(); }
    @GetMapping("/admin") public List<TourPackage> allForAdmin() { return repo.findAllByOrderByIdAsc(); }
    @GetMapping("/admin/{id}") public TourPackage oneForAdmin(@PathVariable("id") Long id) { return repo.findById(id).orElseThrow(); }
    @GetMapping("/{id}") public TourPackage one(@PathVariable("id") Long id) { return repo.findByIdAndAvailableTrue(id).orElseThrow(); }

    @GetMapping("/images/{name:.+}")
    public ResponseEntity<Resource> image(@PathVariable("name") String name) throws IOException {
        Path file = uploadDirectory.resolve(name).normalize();
        if (!file.getParent().equals(uploadDirectory) || !Files.isRegularFile(file)) return ResponseEntity.notFound().build();
        Resource resource = new UrlResource(file.toUri());
        String type = Files.probeContentType(file);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(type == null ? "application/octet-stream" : type)).body(resource);
    }

    @PostMapping public TourPackage create(@RequestBody TourPackage tour) { return repo.save(tour); }

    @PutMapping("/{id}")
    public TourPackage update(@PathVariable("id") Long id, @RequestBody TourPackage tour) {
        TourPackage current = repo.findById(id).orElseThrow();
        current.setDestination(tour.getDestination()); current.setState(tour.getState()); current.setTitle(tour.getTitle());
        current.setDescription(tour.getDescription()); current.setImagePath(tour.getImagePath());
        current.setAccommodationDetails(tour.getAccommodationDetails()); current.setFoodDetails(tour.getFoodDetails());
        current.setFacilities(tour.getFacilities()); current.setPrice(tour.getPrice());
        current.setDurationDays(tour.getDurationDays()); current.setAvailable(tour.isAvailable());
        return repo.save(current);
    }

    @PostMapping(value="/{id}/images", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public TourPackage upload(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) throws IOException {
        TourPackage tour = repo.findById(id).orElseThrow();
        if (file.isEmpty() || file.getSize() > 15L * 1024 * 1024) throw new IllegalArgumentException("Choose an image up to 15 MB.");
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) throw new IllegalArgumentException("Only image files can be uploaded.");
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String name = UUID.randomUUID() + (extension == null ? ".img" : "." + extension.replaceAll("[^A-Za-z0-9]", ""));
        Files.createDirectories(uploadDirectory);
        file.transferTo(uploadDirectory.resolve(name));
        tour.getImages().add("/api/tours/images/" + name);
        if (tour.getImagePath() == null || tour.getImagePath().isBlank()) tour.setImagePath(tour.getImages().get(0));
        return repo.save(tour);
    }

    @PutMapping("/{id}/images")
    @Transactional
    public TourPackage reorderImages(@PathVariable("id") Long id, @RequestBody List<String> images) {
        TourPackage tour = repo.findById(id).orElseThrow();
        if (images == null || images.size() != tour.getImages().size() || !images.containsAll(tour.getImages()))
            throw new IllegalArgumentException("Image order must include every current image exactly once.");
        tour.setImages(images);
        if (!images.isEmpty()) tour.setImagePath(images.get(0));
        return repo.save(tour);
    }

    @DeleteMapping("/{id}/images/{index}")
    @Transactional
    public TourPackage removeImage(@PathVariable("id") Long id, @PathVariable("index") int index) throws IOException {
        TourPackage tour = repo.findById(id).orElseThrow();
        if (index < 0 || index >= tour.getImages().size()) throw new IllegalArgumentException("Image not found.");
        String removed = tour.getImages().remove(index);
        deleteUploadedFile(removed);
        tour.setImagePath(tour.getImages().isEmpty() ? null : tour.getImages().get(0));
        return repo.save(tour);
    }

    @DeleteMapping({"/{id}", "/admin/{id}"})
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws IOException {
        TourPackage tour = repo.findById(id).orElseThrow();
        List<String> uploadedImages = List.copyOf(tour.getImages());
        tour.setAvailable(false);
        tour.getImages().clear();
        tour.setImagePath(null);
        repo.saveAndFlush(tour);
        for (String image : uploadedImages) deleteUploadedFile(image);
        return ResponseEntity.noContent().build();
    }

    private void deleteUploadedFile(String image) throws IOException {
        if (image == null || !image.startsWith("/api/tours/images/")) return;
        String name = image.substring("/api/tours/images/".length());
        Path file = uploadDirectory.resolve(name).normalize();
        if (file.getParent().equals(uploadDirectory)) Files.deleteIfExists(file);
    }
}
