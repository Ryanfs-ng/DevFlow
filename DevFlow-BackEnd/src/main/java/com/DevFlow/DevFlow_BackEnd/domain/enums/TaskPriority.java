package com.DevFlow.DevFlow_BackEnd.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskPriority {
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high"),
    CRITICAL("critical");

    private final String jsonValue;

    TaskPriority(String jsonValue) {
        this.jsonValue = jsonValue;
    }

    @JsonValue
    public String getJsonValue() {
        return jsonValue;
    }

    @JsonCreator
    public static TaskPriority fromJson(String value) {
        if (value == null) {
            return null;
        }
        for (TaskPriority p : values()) {
            if (p.jsonValue.equalsIgnoreCase(value)) {
                return p;
            }
        }
        throw new IllegalArgumentException("TaskPriority desconhecido: " + value);
    }
}
