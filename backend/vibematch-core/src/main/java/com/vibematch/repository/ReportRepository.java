package com.vibematch.repository;

import com.vibematch.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatusOrderByCreatedAtDesc(Report.Status status);
    List<Report> findAllByOrderByCreatedAtDesc();
    long countByStatus(Report.Status status);
}
