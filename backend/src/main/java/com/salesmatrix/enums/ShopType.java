package com.salesmatrix.enums;

import lombok.Getter;

@Getter
public enum ShopType {
    ELECTRONICS("Electronics"),
    BAR("Bar"),
    HOSPITAL("Hospital"),
    RENTALS("Rentals");

    private final String displayName;

    ShopType(String displayName) {
        this.displayName = displayName;
    }

    public static ShopType fromDisplayName(String displayName) {
        for (ShopType type : values()) {
            if (type.getDisplayName().equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown shop type: " + displayName);
    }
}