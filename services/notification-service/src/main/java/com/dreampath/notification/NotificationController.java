package com.dreampath.notification;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/notifications")
public class NotificationController {
 @PostMapping public Map<String,String> send(@RequestBody Map<String,String> request){
   return Map.of("status","SENT","message","Demo notification accepted for "+request.getOrDefault("email","customer"));
 }
}
