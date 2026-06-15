package com.algobuddy.backend.mapper;

import com.algobuddy.backend.dto.MySheetDto;
import com.algobuddy.backend.entity.MySheet;
import org.springframework.stereotype.Component;

@Component
public class MySheetMapper {

    public MySheetDto toDto(MySheet mySheet) {
        if (mySheet == null) {
            return null;
        }
        return MySheetDto.builder()
                .problemId(mySheet.getProblemId())
                .note(mySheet.getNote())
                .addedAt(mySheet.getAddedAt())
                .build();
    }
}
