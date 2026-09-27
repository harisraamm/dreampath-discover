package com.dreampath.tour;

import java.util.List;
import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class OriginalTourPackagesInitializer implements ApplicationRunner {
    private static final Set<String> SAMPLE_TITLES = Set.of(
            "Munnar Tea Trails",
            "Kodaikanal Lakeside Escape",
            "Kolukkumalai Sunrise Trek");
    private static final Set<String> ORIGINAL_TITLES = Set.of(
            "Kolukumalai Stays",
            "Kodaikanal Stays",
            "Kodaikanal Complete Stay",
            "Vattavada Stay",
            "Kanthaloor Stay",
            "Munnar Stays",
            "Munnar Complete Stay");

    private final TourRepository repository;

    public OriginalTourPackagesInitializer(TourRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<TourPackage> current = repository.findAll();
        boolean hasSampleData = current.isEmpty() || current.stream()
                .anyMatch(tour -> SAMPLE_TITLES.contains(tour.getTitle()));
        if (!hasSampleData) {
            return;
        }

        List<TourPackage> outdated = current.stream()
                .filter(tour -> SAMPLE_TITLES.contains(tour.getTitle())
                        || ORIGINAL_TITLES.contains(tour.getTitle()))
                .toList();
        repository.deleteAll(outdated);
        repository.saveAll(List.of(
                tour("Kolukkumalai, Kerala", "Kolukumalai Stays",
                        "Pick your ideal stay: Twilight Tents, The Glass Castle, or The Logwood Cabin.",
                        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1600&q=80",
                        1799, 2),
                tour("Kodaikanal, Tamil Nadu", "Kodaikanal Stays",
                        "Discover five unique stay experiences across the beautiful hills of Kodaikanal. Choose from the Perumalai Mist Cabin, Pannaikadu Stone House, Pannaikadu Log House, Poombarai Twilight Tent and Poombarai Yellow A-Frame.",
                        "/images/kodaikanal/IMG-20260807-WA0029.jpg", 1699, 2),
                tour("Kodaikanal, Tamil Nadu", "Kodaikanal Complete Stay",
                        "Experience Kodaikanal with a complete sightseeing and stay package covering scenic viewpoints, waterfalls, forests, temples, villages and lakes. Enjoy comfortable accommodation, meals and convenient pickup and drop options from selected locations.",
                        "/images/kodaikanal/pannaikadu-log-house/image3.jpg.jpeg", 2299, 1),
                tour("Vattavada, Kerala", "Vattavada Stay",
                        "Wake up among mist-covered mountains and choose from four unique stays: Sky Tent, Mud Hut Stay, Cocoon Stay Mist and Tree House.",
                        "/images/vattavada/sky-tent/IMG-20260808-WA0000.jpg", 1599, 2),
                tour("Kanthaloor, Kerala", "Kanthaloor Stay",
                        "Escape into the hills of Kanthaloor with scenic treks, mountain views, campfire evenings and peaceful stays. Choose between our Tent Stay and A Frame Stay.",
                        "/images/kanthaloor/IMG-20260808-WA0042.jpg", 1599, 2),
                tour("Munnar, Kerala", "Munnar Stays",
                        "Explore beautiful Munnar with premium hill-view accommodation, glamping experiences, sightseeing, waterfalls, trekking and unforgettable mountain adventures.",
                        "/images/munnar/munnar-2d-1n/IMG-20260808-WA0048.jpg", 2999, 2),
                tour("Munnar, Kerala", "Munnar Complete Stay",
                        "Experience a memorable hilltop getaway in Munnar with three unique stay options. Choose from the A-Frame Stay, Hilltop Tent Stay or Double Ducker Stay, with swimming pool activities, campfire evenings, meals and beautiful sunrise views.",
                        "/images/munnar frame stay/WhatsApp Image 2026-08-11 at 11.52.06 AM (2).jpeg", 1499, 2)));
    }

    private TourPackage tour(String destination, String title, String description,
                             String imagePath, double price, int durationDays) {
        TourPackage tour = new TourPackage(destination, title, description, price, durationDays);
        tour.setImagePath(imagePath);
        return tour;
    }
}
