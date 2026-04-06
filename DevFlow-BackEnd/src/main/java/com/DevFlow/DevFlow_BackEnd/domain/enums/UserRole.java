package com.DevFlow.DevFlow_BackEnd.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    ADMIN("admin"),
    DEVELOPER("developer"),
    DESIGNER("designer"),
    MANAGER("manager"),
    QA("qa");

    private final String jsonValue;

    UserRole(String jsonValue) {
        this.jsonValue = jsonValue;
    }

    @JsonValue
    public String getJsonValue() {
        return jsonValue;
    }

    @JsonCreator
    public static UserRole fromJson(String value) {
        if (value == null) {
            return null;
        }
        for (UserRole r : values()) {
            if (r.jsonValue.equalsIgnoreCase(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("UserRole desconhecido: " + value);
    }
}
