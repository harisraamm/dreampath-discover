package com.dreampath.booking;
import jakarta.persistence.*;
@Entity @Table(name="bookings")
public class Booking {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long userId; private Long tourId; private int guests; private String travelDate; private String status="PENDING";
 public Booking(){} public Long getId(){return id;} public Long getUserId(){return userId;} public void setUserId(Long v){userId=v;}
 public Long getTourId(){return tourId;} public void setTourId(Long v){tourId=v;} public int getGuests(){return guests;} public void setGuests(int v){guests=v;}
 public String getTravelDate(){return travelDate;} public void setTravelDate(String v){travelDate=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;}
}
