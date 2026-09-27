package com.dreampath.payment;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/payments")
public class PaymentController {
 private final PaymentRepository repo; public PaymentController(PaymentRepository repo){this.repo=repo;}
 @GetMapping public List<Payment> all(){return repo.findAll();}
 @PostMapping public Payment create(@RequestBody Payment p){return repo.save(p);}
}
