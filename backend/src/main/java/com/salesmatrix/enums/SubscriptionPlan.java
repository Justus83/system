package com.salesmatrix.enums;

import lombok.Getter;

@Getter
public enum SubscriptionPlan {
    
    STARTER("Starter", 1, -1, 0, 8.00),
    PRO("Pro", 2, -1, 2, 12.99),
    ULTIMATE("Ultimate", 5, -1, 10, 30.00),
    ENTERPRISE("Enterprise", -1, -1, -1, 50.00);

    private final String displayName;
    private final int maxStores;
    private final int maxUsers;
    private final int maxBranches;
    private final double price;

    SubscriptionPlan(String displayName, int maxStores, int maxUsers, int maxBranches, double price) {
        this.displayName = displayName;
        this.maxStores = maxStores;
        this.maxUsers = maxUsers;
        this.maxBranches = maxBranches;
        this.price = price;
    }

    public boolean isUnlimitedStores() {
        return maxStores == -1;
    }

    public boolean isUnlimitedUsers() {
        return maxUsers == -1;
    }

    public boolean isUnlimitedBranches() {
        return maxBranches == -1;
    }
}  
