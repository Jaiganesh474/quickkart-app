package com.quickkart.controller;

import com.quickkart.entity.Address;
import com.quickkart.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*") // For development
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    // We use a dummy user ID for now as requested
    private final Long DUMMY_USER_ID = 1L;

    @GetMapping
    public List<Address> getUserAddresses() {
        return addressRepository.findByUserId(DUMMY_USER_ID);
    }

    @PostMapping
    public Address addAddress(@RequestBody Address address) {
        address.setUserId(DUMMY_USER_ID);
        return addressRepository.save(address);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        return addressRepository.findById(id).map(address -> {
            if (address.getUserId().equals(DUMMY_USER_ID)) {
                addressRepository.delete(address);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.status(403).build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
