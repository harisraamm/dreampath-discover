package com.dreampath.tour;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity @Table(name="tour_packages")
public class TourPackage {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String destination; private String state; private String title; private String description; private String imagePath;
 private String accommodationDetails; private String foodDetails; private String facilities;
 private double price; private int durationDays; private boolean available=true;
 @ElementCollection(fetch=FetchType.EAGER)
 @CollectionTable(name="tour_package_images", joinColumns=@JoinColumn(name="tour_package_id"))
 @OrderColumn(name="display_order")
 @Column(name="image_path", nullable=false, length=600)
 private List<String> images = new ArrayList<>();
 public TourPackage(){}
 public TourPackage(String destination,String title,String description,double price,int durationDays){this.destination=destination;this.title=title;this.description=description;this.price=price;this.durationDays=durationDays;}
 public Long getId(){return id;} public String getDestination(){return destination;} public void setDestination(String v){destination=v;}
 public String getState(){return state;} public void setState(String v){state=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public String getImagePath(){return imagePath;} public void setImagePath(String v){imagePath=v;}
 public String getAccommodationDetails(){return accommodationDetails;} public void setAccommodationDetails(String v){accommodationDetails=v;}
 public String getFoodDetails(){return foodDetails;} public void setFoodDetails(String v){foodDetails=v;}
 public String getFacilities(){return facilities;} public void setFacilities(String v){facilities=v;}
 public double getPrice(){return price;} public void setPrice(double v){price=v;} public int getDurationDays(){return durationDays;} public void setDurationDays(int v){durationDays=v;}
 public boolean isAvailable(){return available;} public void setAvailable(boolean v){available=v;}
 public List<String> getImages(){return images;} public void setImages(List<String> v){images=v==null?new ArrayList<>():new ArrayList<>(v);}
}
