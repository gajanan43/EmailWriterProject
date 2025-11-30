package com.example.EmailWriter.controller;

import com.example.EmailWriter.model.EmailRequest;
import com.example.EmailWriter.service.EmailGeneratorService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity< String> generateEmail(@RequestBody EmailRequest emailRequest) {

        String reply = emailGeneratorService.generateEmailReply(emailRequest);

        return ResponseEntity.ok(reply);
    }


}
