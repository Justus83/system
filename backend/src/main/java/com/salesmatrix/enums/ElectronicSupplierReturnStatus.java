package com.salesmatrix.enums;

public enum ElectronicSupplierReturnStatus {
    RETURNED_TO_SUPPLIER("Returned to Supplier"),
    RETURNED_TO_SUPPLIER_REPLACED("Returned to Supplier - Replaced");

    private final String description;

    ElectronicSupplierReturnStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
