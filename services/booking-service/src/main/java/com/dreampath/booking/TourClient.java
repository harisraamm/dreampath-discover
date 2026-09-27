package com.dreampath.booking;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
@FeignClient(name="tour-service")
public interface TourClient {
 @GetMapping("/api/tours/{id}") Object getTour(@PathVariable("id") Long id);
}
