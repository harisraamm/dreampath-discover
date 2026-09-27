package com.dreampath.payment;
import jakarta.persistence.*;
@Entity @Table(name="payments")
public class Payment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long bookingId; private double amount; private String method; private String status="SUCCESS";
 public Payment(){} public Long getId(){return id;} public Long getBookingId(){return bookingId;} public void setBookingId(Long v){bookingId=v;}
 public double getAmount(){return amount;} public void setAmount(double v){amount=v;} public String getMethod(){return method;} public void setMethod(String v){method=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
}
