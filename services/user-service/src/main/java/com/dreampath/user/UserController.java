package com.dreampath.user;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/users")
public class UserController {
 private final UserRepository repo; public UserController(UserRepository repo){this.repo=repo;}
 @GetMapping public List<User> all(){return repo.findAll();}
 @GetMapping("/{id}") public User one(@PathVariable("id") Long id){return repo.findById(id).orElseThrow();}
 @PostMapping public User create(@RequestBody User u){return repo.save(u);}
 @PutMapping("/{id}") public User update(@PathVariable("id") Long id,@RequestBody User u){
  User x=repo.findById(id).orElseThrow(); x.setName(u.getName()); x.setEmail(u.getEmail()); x.setPhone(u.getPhone()); return repo.save(x);
 }
 @DeleteMapping("/{id}") public void delete(@PathVariable("id") Long id){repo.deleteById(id);}
}
