-- ============================================================
--  Blood Donation Management System — Railway DB Init Script
--  Run this once in Railway MySQL console after deployment
-- ============================================================

CREATE DATABASE IF NOT EXISTS blood_donation_db;
USE blood_donation_db;

-- 1. Blood_Group
CREATE TABLE IF NOT EXISTS Blood_Group (
    blood_group_id INT PRIMARY KEY,
    blood_group    VARCHAR(5) NOT NULL UNIQUE
);

-- 2. Hospital
CREATE TABLE IF NOT EXISTS Hospital (
    hospital_id INT          PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    location    VARCHAR(150) NOT NULL,
    phone       VARCHAR(20)  NOT NULL
);

-- 3. Request_Status
CREATE TABLE IF NOT EXISTS Request_Status (
    status_id   INT         PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Donation_Center
CREATE TABLE IF NOT EXISTS Donation_Center (
    center_id  INT          PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    location   VARCHAR(150) NOT NULL,
    contact_no VARCHAR(20)  NOT NULL
);

-- 5. Donor
CREATE TABLE IF NOT EXISTS Donor (
    donor_id     INT          PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    dob          DATE         NOT NULL,
    gender       VARCHAR(10)  NOT NULL,
    phone        VARCHAR(20)  NOT NULL,
    email        VARCHAR(100) UNIQUE,
    address      VARCHAR(200),
    availability VARCHAR(20)  NOT NULL DEFAULT 'Available'
);

-- 6. Recipient
CREATE TABLE IF NOT EXISTS Recipient (
    recipient_id INT          PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    gender       VARCHAR(10)  NOT NULL,
    age          INT          NOT NULL,
    phone        VARCHAR(20)  NOT NULL,
    address      VARCHAR(200)
);

-- 7. Admin
CREATE TABLE IF NOT EXISTS Admin (
    admin_id INT          PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 8. Donation
CREATE TABLE IF NOT EXISTS Donation (
    donation_id    INT  PRIMARY KEY AUTO_INCREMENT,
    donor_id       INT  NOT NULL,
    blood_group_id INT  NOT NULL,
    donation_date  DATE NOT NULL,
    quantity       INT  NOT NULL,
    FOREIGN KEY (donor_id)       REFERENCES Donor(donor_id),
    FOREIGN KEY (blood_group_id) REFERENCES Blood_Group(blood_group_id)
);

-- 9. Blood_Inventory
CREATE TABLE IF NOT EXISTS Blood_Inventory (
    inventory_id   INT      PRIMARY KEY AUTO_INCREMENT,
    blood_group_id INT      NOT NULL,
    blood_bank_id  INT      NOT NULL,
    quantity       INT      NOT NULL,
    last_updated   DATETIME NOT NULL,
    FOREIGN KEY (blood_group_id) REFERENCES Blood_Group(blood_group_id),
    FOREIGN KEY (blood_bank_id)  REFERENCES Hospital(hospital_id)
);

-- 10. Blood_Request
CREATE TABLE IF NOT EXISTS Blood_Request (
    request_id     INT  PRIMARY KEY AUTO_INCREMENT,
    recipient_id   INT  NOT NULL,
    hospital_id    INT  NOT NULL,
    blood_group_id INT  NOT NULL,
    status_id      INT  NOT NULL,
    request_date   DATE NOT NULL,
    quantity       INT  NOT NULL,
    FOREIGN KEY (recipient_id)   REFERENCES Recipient(recipient_id),
    FOREIGN KEY (hospital_id)    REFERENCES Hospital(hospital_id),
    FOREIGN KEY (blood_group_id) REFERENCES Blood_Group(blood_group_id),
    FOREIGN KEY (status_id)      REFERENCES Request_Status(status_id)
);

-- 11. Appointment
CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id   INT         PRIMARY KEY AUTO_INCREMENT,
    donor_id         INT         NOT NULL,
    center_id        INT         NOT NULL,
    appointment_date DATE        NOT NULL,
    status           VARCHAR(20) NOT NULL,
    FOREIGN KEY (donor_id)  REFERENCES Donor(donor_id),
    FOREIGN KEY (center_id) REFERENCES Donation_Center(center_id)
);

-- 12. Donor_Contact
CREATE TABLE IF NOT EXISTS Donor_Contact (
    donor_contact_id INT         PRIMARY KEY AUTO_INCREMENT,
    donor_id         INT         NOT NULL,
    phone            VARCHAR(20) NOT NULL,
    email            VARCHAR(100),
    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id)
);

-- 13. Recipient_Contact
CREATE TABLE IF NOT EXISTS Recipient_Contact (
    recipient_contact_id INT         PRIMARY KEY AUTO_INCREMENT,
    recipient_id         INT         NOT NULL,
    phone                VARCHAR(20) NOT NULL,
    email                VARCHAR(100),
    FOREIGN KEY (recipient_id) REFERENCES Recipient(recipient_id)
);

-- 14. Emergency_Request
CREATE TABLE IF NOT EXISTS Emergency_Request (
    emergency_id   INT         PRIMARY KEY AUTO_INCREMENT,
    recipient_id   INT         NOT NULL,
    blood_group_id INT         NOT NULL,
    hospital_id    INT         NOT NULL,
    request_date   DATE        NOT NULL,
    status         VARCHAR(30) NOT NULL,
    FOREIGN KEY (recipient_id)   REFERENCES Recipient(recipient_id),
    FOREIGN KEY (blood_group_id) REFERENCES Blood_Group(blood_group_id),
    FOREIGN KEY (hospital_id)    REFERENCES Hospital(hospital_id)
);

-- 15. Donation_Certificate
CREATE TABLE IF NOT EXISTS Donation_Certificate (
    certificate_id INT         PRIMARY KEY AUTO_INCREMENT,
    donation_id    INT         NOT NULL,
    issue_date     DATE        NOT NULL,
    certificate_no VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (donation_id) REFERENCES Donation(donation_id)
);

-- ── Sample Data ───────────────────────────────────────────────

INSERT IGNORE INTO Blood_Group VALUES
(1,'A+'),(2,'A-'),(3,'B+'),(4,'B-'),(5,'AB+'),(6,'AB-'),(7,'O+'),(8,'O-');

INSERT IGNORE INTO Hospital VALUES
(1,'Dhaka Medical College Hospital','Dhaka, Bangladesh','02-55165088'),
(2,'Square Hospital Ltd.','Panthapath, Dhaka','02-55165000'),
(3,'Chittagong General Hospital','Chittagong, Bangladesh','031-2517621');

INSERT IGNORE INTO Request_Status VALUES
(1,'Pending'),(2,'Approved'),(3,'Fulfilled'),(4,'Rejected'),(5,'Cancelled');

INSERT IGNORE INTO Donation_Center VALUES
(1,'Quantum Blood Center','Mirpur, Dhaka','01711-000001'),
(2,'Sandhani Donation Center','Shahbag, Dhaka','01711-000002'),
(3,'Red Crescent Blood Center','Agrabad, Chittagong','01711-000003');

INSERT IGNORE INTO Donor (donor_id,name,dob,gender,phone,email,address,availability) VALUES
(1,'Arif Hossain','1992-05-14','Male','01712-345678','arif.hossain@email.com','Mirpur, Dhaka','Available'),
(2,'Sadia Islam','1995-08-22','Female','01712-456789','sadia.islam@email.com','Banani, Dhaka','Available'),
(3,'Kamal Uddin','1988-11-30','Male','01712-567890','kamal.uddin@email.com','Chittagong','Unavailable'),
(4,'Nusrat Jahan','1999-03-17','Female','01712-678901','nusrat.jahan@email.com','Uttara, Dhaka','Available'),
(5,'Rahim Chowdhury','1985-07-09','Male','01712-789012','rahim.chowdhury@email.com','Farmgate, Dhaka','Available');

INSERT IGNORE INTO Recipient (recipient_id,name,gender,age,phone,address) VALUES
(1,'Mehedi Hassan','Male',35,'01812-111222','Uttara, Dhaka'),
(2,'Fatema Begum','Female',52,'01812-222333','Wari, Old Dhaka'),
(3,'Tanvir Ahmed','Male',28,'01812-333444','Khulna, Bangladesh'),
(4,'Roksana Akter','Female',44,'01812-444555','Sylhet, Bangladesh'),
(5,'Jalal Uddin','Male',67,'01812-555666','Rajshahi, Bangladesh');

INSERT IGNORE INTO Admin VALUES
(1,'System Admin','admin@bloodbank.org','hashed_pass_admin1'),
(2,'Reza Khan','reza.khan@bloodbank.org','hashed_pass_reza'),
(3,'Mitu Sarker','mitu.s@bloodbank.org','hashed_pass_mitu');

INSERT IGNORE INTO Donation (donation_id,donor_id,blood_group_id,donation_date,quantity) VALUES
(1,1,1,'2026-01-10',450),(2,2,3,'2026-02-15',450),
(3,4,7,'2026-03-20',350),(4,5,5,'2026-04-05',450),(5,1,1,'2026-07-12',450);

INSERT IGNORE INTO Blood_Inventory (inventory_id,blood_group_id,blood_bank_id,quantity,last_updated) VALUES
(1,1,1,2700,'2026-09-01 09:00:00'),(2,3,1,1800,'2026-09-01 09:00:00'),
(3,7,2,3600,'2026-09-02 10:30:00'),(4,5,2,900,'2026-09-02 10:30:00'),
(5,8,3,1350,'2026-09-03 08:00:00');

INSERT IGNORE INTO Blood_Request VALUES
(1,1,1,1,3,'2026-08-01',450),(2,2,2,3,2,'2026-08-10',350),
(3,3,3,7,1,'2026-09-05',450),(4,4,1,5,4,'2026-09-08',450),(5,5,2,8,1,'2026-09-13',350);

INSERT IGNORE INTO Appointment VALUES
(1,1,1,'2026-09-15','Scheduled'),(2,2,2,'2026-09-16','Scheduled'),
(3,4,1,'2026-09-17','Completed'),(4,5,3,'2026-09-18','Cancelled'),(5,3,2,'2026-09-20','Scheduled');

INSERT IGNORE INTO Donor_Contact VALUES
(1,1,'01912-345678','arif.alt@email.com'),(2,2,'01912-456789','sadia.alt@email.com'),
(3,3,'01912-567890',NULL),(4,4,'01912-678901','nusrat.alt@email.com'),(5,5,'01912-789012','rahim.alt@email.com');

INSERT IGNORE INTO Recipient_Contact VALUES
(1,1,'01913-111222','mehedi.alt@email.com'),(2,2,'01913-222333',NULL),
(3,3,'01913-333444','tanvir.alt@email.com'),(4,4,'01913-444555','roksana.alt@email.com'),(5,5,'01913-555666',NULL);

INSERT IGNORE INTO Emergency_Request VALUES
(1,1,1,1,'2026-09-10','Fulfilled'),(2,3,7,3,'2026-09-11','Pending'),
(3,5,8,2,'2026-09-12','Critical'),(4,2,3,1,'2026-09-13','Pending'),(5,4,5,2,'2026-09-14','Fulfilled');

INSERT IGNORE INTO Donation_Certificate VALUES
(1,1,'2026-01-11','CERT-2026-0001'),(2,2,'2026-02-16','CERT-2026-0002'),
(3,3,'2026-03-21','CERT-2026-0003'),(4,4,'2026-04-06','CERT-2026-0004'),(5,5,'2026-07-13','CERT-2026-0005');
