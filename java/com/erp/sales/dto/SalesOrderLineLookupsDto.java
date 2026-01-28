package com.erp.sales.dto;

import java.util.List;

public class SalesOrderLineLookupsDto {

    private List<String> units;
    private List<String> sizes;
    private List<String> nationalSizes;
    private List<String> styles;
    private List<String> cuttingNos;
    private List<String> colors;
    private List<String> destinations;

    public List<String> getUnits() {
        return units;
    }

    public void setUnits(List<String> units) {
        this.units = units;
    }

    public List<String> getSizes() {
        return sizes;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes;
    }

    public List<String> getNationalSizes() {
        return nationalSizes;
    }

    public void setNationalSizes(List<String> nationalSizes) {
        this.nationalSizes = nationalSizes;
    }

    public List<String> getStyles() {
        return styles;
    }

    public void setStyles(List<String> styles) {
        this.styles = styles;
    }

    public List<String> getCuttingNos() {
        return cuttingNos;
    }

    public void setCuttingNos(List<String> cuttingNos) {
        this.cuttingNos = cuttingNos;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public List<String> getDestinations() {
        return destinations;
    }

    public void setDestinations(List<String> destinations) {
        this.destinations = destinations;
    }
}
