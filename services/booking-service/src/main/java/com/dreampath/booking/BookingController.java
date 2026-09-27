package com.dreampath.booking;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/bookings")
public class BookingController {
 private final BookingRepository repo; private final TourClient tourClient;
 public BookingController(BookingRepository repo,TourClient tourClient){this.repo=repo;this.tourClient=tourClient;}
 @GetMapping public List<Booking> all(){return repo.findAll();}
 @GetMapping("/{id}") public Booking one(@PathVariable Long id){return repo.findById(id).orElseThrow();}
 @PostMapping public Booking create(@RequestBody Booking b){tourClient.getTour(b.getTourId()); return repo.save(b);}
 @PutMapping("/{id}/status") public Booking status(@PathVariable Long id,@RequestParam String value){Booking b=repo.findById(id).orElseThrow();b.setStatus(value);return repo.save(b);}
}
