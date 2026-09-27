package com.dreampath.tour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TourRepository extends JpaRepository<TourPackage,Long> {
    List<TourPackage> findAllByAvailableTrueOrderByIdAsc();
    List<TourPackage> findAllByOrderByIdAsc();
    Optional<TourPackage> findByIdAndAvailableTrue(Long id);
}
