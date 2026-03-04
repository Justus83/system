package com.salesmatrix.service;

import com.salesmatrix.dto.BarShiftDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface BarShiftService {

    BarShiftDTO startShift(BarShiftDTO shiftDTO);

    BarShiftDTO endShift(Long shiftId, BarShiftDTO shiftDTO);

    BarShiftDTO getShiftById(Long id);

    List<BarShiftDTO> getAllShifts();

    List<BarShiftDTO> getShiftsByCounter(Long counterId);

    List<BarShiftDTO> getShiftsByUser(Long userId);

    List<BarShiftDTO> getShiftsByStore(Long storeId);

    BarShiftDTO getActiveShiftByCounter(Long counterId);

    BarShiftDTO getLastClosedShiftByCounter(Long counterId);

    List<BarShiftDTO> getShiftsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    void deleteShift(Long id);
}
