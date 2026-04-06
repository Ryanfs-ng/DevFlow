package com.DevFlow.DevFlow_BackEnd.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    BACKLOG("backlog"),
    TODO("todo"),
    DOING("doing"),
    REVIEW("review"),
    DONE("done");

    private final String jsonValue;

    TaskStatus(String jsonValue) {
        this.jsonValue = jsonValue;
    }

    @JsonValue
    public String getJsonValue() {
        return jsonValue;
    }

    @JsonCreator
    public static TaskStatus fromJson(String value) {
        if (value == null) {
            return null;
        }
        for (TaskStatus s : values()) {
            if (s.jsonValue.equalsIgnoreCase(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("TaskStatus desconhecido: " + value);
    }
}
