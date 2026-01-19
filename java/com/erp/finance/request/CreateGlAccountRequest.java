package com.erp.finance.request;

import com.erp.finance.model.GlAccountType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateGlAccountRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    @NotNull
    private GlAccountType type;

    private Boolean active;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GlAccountType getType() {
        return type;
    }

    public void setType(GlAccountType type) {
        this.type = type;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
