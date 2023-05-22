//package io.github.xanderendre.CustomerService.model;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.*;
//import org.hibernate.annotations.GenericGenerator;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Entity
//@Table(name = "customer")
//public class CustomerOld {
//
//    @Id
//    @GeneratedValue(generator = "UUID")
//    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
//    @Column(name = "id", updatable = false, nullable = false)
//    private UUID id;
//
//    @Column(name = "name")
//    private String name;
//
////    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonProperty("parent_id")
//    @JoinColumn(name = "parent_id", nullable = false)
//    private UUID customerParentId;
//
////    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonProperty("address_id")
//    @JoinColumn(name = "address_id", nullable = false)
//    private UUID addressId;
//
////    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonProperty("shipping_address_id")
//    @JoinColumn(name = "shipping_address_id", nullable = false)
//    private UUID shippingAddressId;
//
////    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonProperty("primary_contact_id")
//    @JoinColumn(name = "primary_contact_id", nullable = false)
//    private UUID primaryContactId;
//
//    @Column(name = "is_active")
//    private boolean isActive;
//
//    @Column(name = "date_created")
//    private LocalDateTime dateCreated;
//
//    @Column(name = "date_modified")
//    private LocalDateTime dateModified;
//
//    public CustomerOld() {
//        this.id = UUID.randomUUID();
//        this.dateCreated = LocalDateTime.now();
//        this.dateModified = LocalDateTime.now();
//    }
//
//    public UUID getId() {
//        return id;
//    }
//
//    public void setId(UUID id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public UUID getCustomerParentId() {
//        return customerParentId;
//    }
//
//    public void setCustomerParentId(UUID customerParentId) {
//        this.customerParentId = customerParentId;
//    }
//
//    public UUID getAddressId() {
//        return addressId;
//    }
//
//    public void setAddressId(UUID addressId) {
//        this.addressId = addressId;
//    }
//
//    public UUID getShippingAddressId() {
//        return shippingAddressId;
//    }
//
//    public void setShippingAddressId(UUID shippingAddressId) {
//        this.shippingAddressId = shippingAddressId;
//    }
//
//    public UUID getPrimaryContactId() {
//        return primaryContactId;
//    }
//
//    public void setPrimaryContactId(UUID primaryContactId) {
//        this.primaryContactId = primaryContactId;
//    }
//
//    public LocalDateTime getDateCreated() {
//        return dateCreated;
//    }
//
//    public void setDateCreated(LocalDateTime dateCreated) {
//        this.dateCreated = dateCreated;
//    }
//
//    public LocalDateTime getDateModified() {
//        return dateModified;
//    }
//
//    public void setDateModified(LocalDateTime dateModified) {
//        this.dateModified = dateModified;
//    }
//
//    public boolean isActive() {
//        return isActive;
//    }
//
//    public void setActive(boolean isActive) {
//        this.isActive = isActive;
//    }
//
//    @Override
//    public String toString() {
//        return "Customer{" +
//                "id=" + id +
//                ", name='" + name + '\'' +
//                ", customerParentId=" + customerParentId +
//                ", addressId=" + addressId +
//                ", shippingAddressId=" + shippingAddressId +
//                ", primaryContactId=" + primaryContactId +
//                ", isActive=" + isActive +
//                ", dateCreated=" + dateCreated +
//                ", dateModified=" + dateModified +
//                '}';
//    }
//}