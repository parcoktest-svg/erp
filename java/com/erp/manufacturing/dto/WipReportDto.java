package com.erp.manufacturing.dto;

import java.util.ArrayList;
import java.util.List;

public class WipReportDto {

    private List<WipWorkOrderRowDto> rows = new ArrayList<>();

    public List<WipWorkOrderRowDto> getRows() {
        return rows;
    }

    public void setRows(List<WipWorkOrderRowDto> rows) {
        this.rows = rows;
    }
}
