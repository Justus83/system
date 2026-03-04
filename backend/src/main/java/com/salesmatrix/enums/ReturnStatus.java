package com.salesmatrix.enums;

public enum ReturnStatus {
    RETURNED_TO_STOCK("Returned to Stock - Available"),
    RETURNED_TO_SUPPLIER("Returned to Supplier"),
    TOTAL_LOSS("Total Loss");

    private final String description;

    ReturnStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
