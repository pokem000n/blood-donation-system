-- =========================================================
-- BLOOD DONATION MANAGEMENT SYSTEM
-- 15 TABLE DATABASE
-- =========================================================

DROP DATABASE IF EXISTS blood_donation_db;

CREATE DATABASE blood_donation_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE blood_donation_db;


-- =========================================================
-- 1. BLOOD_GROUP
-- =========================================================

CREATE TABLE Blood_Group (
    blood_group_id INT PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL UNIQUE
);


-- =========================================================
-- 2. HOSPITAL
-- =========================================================

CREATE TABLE Hospital (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE
);


-- =========================================================
-- 3. DONATION_CENTER
-- =========================================================

CREATE TABLE Donation_Center (
    center_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE
);


-- =========================================================
-- 4. DONOR
-- =========================================================

CREATE TABLE Donor (
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    address VARCHAR(200),

    availability ENUM('Available','Resting','Unavailable')
        NOT NULL DEFAULT 'Available',

    last_donation_date DATE NULL,
    next_eligible_date DATE NULL,

    CHECK (next_eligible_date IS NULL 
           OR last_donation_date IS NULL 
           OR next_eligible_date >= last_donation_date)
);


-- =========================================================
-- 5. RECIPIENT
-- =========================================================

CREATE TABLE Recipient (
    recipient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(200),

    CHECK (age > 0 AND age <= 120)
);


-- =========================================================
-- 6. ADMIN
-- =========================================================

CREATE TABLE Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);


-- =========================================================
-- 7. DONATION
-- =========================================================

CREATE TABLE Donation (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,

    donor_id INT NOT NULL,
    blood_group_id INT NOT NULL,

    donation_date DATE NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (donor_id)
        REFERENCES Donor(donor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (blood_group_id)
        REFERENCES Blood_Group(blood_group_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CHECK (quantity > 0)
);


-- =========================================================
-- 8. BLOOD_INVENTORY
-- =========================================================

CREATE TABLE Blood_Inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,

    blood_group_id INT NOT NULL,
    hospital_id INT NOT NULL,

    quantity INT NOT NULL DEFAULT 0,
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (blood_group_id)
        REFERENCES Blood_Group(blood_group_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (hospital_id)
        REFERENCES Hospital(hospital_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE (blood_group_id, hospital_id),

    CHECK (quantity >= 0)
);


-- =========================================================
-- 9. BLOOD_REQUEST
-- =========================================================

CREATE TABLE Blood_Request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,

    recipient_id INT NOT NULL,
    hospital_id INT NOT NULL,
    blood_group_id INT NOT NULL,

    request_date DATE NOT NULL,
    quantity INT NOT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Fulfilled',
        'Rejected',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    request_type ENUM(
        'Normal',
        'Emergency'
    ) NOT NULL DEFAULT 'Normal',

    FOREIGN KEY (recipient_id)
        REFERENCES Recipient(recipient_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (hospital_id)
        REFERENCES Hospital(hospital_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (blood_group_id)
        REFERENCES Blood_Group(blood_group_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CHECK (quantity > 0)
);


-- =========================================================
-- 10. APPOINTMENT
-- =========================================================

CREATE TABLE Appointment (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,

    donor_id INT NOT NULL,
    center_id INT NOT NULL,

    appointment_date DATE NOT NULL,

    status ENUM(
        'Scheduled',
        'Completed',
        'Cancelled'
    ) NOT NULL DEFAULT 'Scheduled',

    FOREIGN KEY (donor_id)
        REFERENCES Donor(donor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (center_id)
        REFERENCES Donation_Center(center_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =========================================================
-- 11. USER
-- =========================================================

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    role ENUM(
        'Donor',
        'Recipient',
        'Admin'
    ) NOT NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 12. BLOOD_CAMP
-- =========================================================

CREATE TABLE Blood_Camp (
    camp_id INT PRIMARY KEY AUTO_INCREMENT,

    camp_name VARCHAR(150) NOT NULL,
    camp_date DATE NOT NULL,
    location VARCHAR(150) NOT NULL,

    organizer VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,

    description VARCHAR(500),

    status ENUM(
        'Upcoming',
        'Ongoing',
        'Completed',
        'Cancelled'
    ) NOT NULL DEFAULT 'Upcoming'
);


-- =========================================================
-- 13. BLOOD_TEST
-- =========================================================

CREATE TABLE Blood_Test (
    test_id INT PRIMARY KEY AUTO_INCREMENT,

    donation_id INT NOT NULL,

    test_date DATE NOT NULL,

    hiv_status ENUM('Negative','Positive','Pending')
        NOT NULL DEFAULT 'Pending',

    hepatitis_status ENUM('Negative','Positive','Pending')
        NOT NULL DEFAULT 'Pending',

    syphilis_status ENUM('Negative','Positive','Pending')
        NOT NULL DEFAULT 'Pending',

    blood_test_result ENUM(
        'Safe',
        'Unsafe',
        'Pending'
    ) NOT NULL DEFAULT 'Pending',

    FOREIGN KEY (donation_id)
        REFERENCES Donation(donation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE (donation_id)
);


-- =========================================================
-- 14. STAFF
-- =========================================================

CREATE TABLE Staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,

    hospital_id INT NOT NULL,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,

    position VARCHAR(50) NOT NULL,

    FOREIGN KEY (hospital_id)
        REFERENCES Hospital(hospital_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =========================================================
-- 15. BLOOD_CAMP_REGISTRATION
-- =========================================================

CREATE TABLE Blood_Camp_Registration (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,

    camp_id INT NOT NULL,
    donor_id INT NOT NULL,

    registration_date DATE NOT NULL,

    status ENUM(
        'Registered',
        'Completed',
        'Cancelled'
    ) NOT NULL DEFAULT 'Registered',

    FOREIGN KEY (camp_id)
        REFERENCES Blood_Camp(camp_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (donor_id)
        REFERENCES Donor(donor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE (camp_id, donor_id)
);


-- =========================================================
-- SAMPLE DATA
-- =========================================================


-- =========================================================
-- 1. BLOOD GROUP DATA
-- =========================================================

INSERT INTO Blood_Group (blood_group_id, blood_group) VALUES
(1, 'A+'),
(2, 'A-'),
(3, 'B+'),
(4, 'B-'),
(5, 'AB+'),
(6, 'AB-'),
(7, 'O+'),
(8, 'O-');


-- =========================================================
-- 2. HOSPITAL DATA
-- =========================================================

INSERT INTO Hospital
(name, location, phone, email)
VALUES
('Dhaka Medical College Hospital',
 'Dhaka, Bangladesh',
 '02-55165088',
 'info@dmch.gov.bd'),

('Square Hospital Ltd.',
 'Panthapath, Dhaka',
 '02-55165000',
 'info@squarehospital.com'),

('Chittagong General Hospital',
 'Chittagong, Bangladesh',
 '031-2517621',
 'info@cgh.gov.bd'),

('United Hospital Limited',
 'Gulshan, Dhaka',
 '02-8836442',
 'info@uhlbd.com'),

('Evercare Hospital Dhaka',
 'Bashundhara, Dhaka',
 '02-8431661',
 'info@evercarebd.com');


-- =========================================================
-- 3. DONATION CENTER DATA
-- =========================================================

INSERT INTO Donation_Center
(name, location, contact_no, email)
VALUES
('Quantum Blood Center',
 'Mirpur, Dhaka',
 '01711-000001',
 'quantum@blood.org'),

('Sandhani Donation Center',
 'Shahbag, Dhaka',
 '01711-000002',
 'sandhani@blood.org'),

('Red Crescent Blood Center',
 'Agrabad, Chittagong',
 '01711-000003',
 'redcrescent@blood.org'),

('Life Saver Donation Center',
 'Dhanmondi, Dhaka',
 '01711-000004',
 'lifesaver@blood.org');


-- =========================================================
-- 4. DONOR DATA
-- =========================================================

INSERT INTO Donor
(name, dob, gender, phone, email, address,
 availability, last_donation_date, next_eligible_date)
VALUES

('Arif Hossain',
 '1992-05-14',
 'Male',
 '01712-345678',
 'arif.hossain@email.com',
 'Mirpur, Dhaka',
 'Resting',
 '2026-07-12',
 '2026-10-12'),

('Sadia Islam',
 '1995-08-22',
 'Female',
 '01712-456789',
 'sadia.islam@email.com',
 'Banani, Dhaka',
 'Resting',
 '2026-08-15',
 '2026-11-15'),

('Kamal Uddin',
 '1988-11-30',
 'Male',
 '01712-567890',
 'kamal.uddin@email.com',
 'Chittagong',
 'Unavailable',
 '2026-06-10',
 '2026-09-10'),

('Nusrat Jahan',
 '1999-03-17',
 'Female',
 '01712-678901',
 'nusrat.jahan@email.com',
 'Uttara, Dhaka',
 'Available',
 NULL,
 NULL),

('Rahim Chowdhury',
 '1985-07-09',
 'Male',
 '01712-789012',
 'rahim.chowdhury@email.com',
 'Farmgate, Dhaka',
 'Available',
 '2026-05-01',
 '2026-08-01'),

('Tania Akter',
 '1997-02-11',
 'Female',
 '01712-890123',
 'tania.akter@email.com',
 'Dhanmondi, Dhaka',
 'Available',
 NULL,
 NULL),

('Hasan Mahmud',
 '1990-10-25',
 'Male',
 '01712-901234',
 'hasan.mahmud@email.com',
 'Mohammadpur, Dhaka',
 'Available',
 NULL,
 NULL);


-- =========================================================
-- 5. RECIPIENT DATA
-- =========================================================

INSERT INTO Recipient
(name, gender, age, phone, email, address)
VALUES

('Mehedi Hassan',
 'Male',
 35,
 '01812-111222',
 'mehedi@email.com',
 'Uttara, Dhaka'),

('Fatema Begum',
 'Female',
 52,
 '01812-222333',
 'fatema@email.com',
 'Wari, Old Dhaka'),

('Tanvir Ahmed',
 'Male',
 28,
 '01812-333444',
 'tanvir@email.com',
 'Khulna, Bangladesh'),

('Roksana Akter',
 'Female',
 44,
 '01812-444555',
 'roksana@email.com',
 'Sylhet, Bangladesh'),

('Jalal Uddin',
 'Male',
 67,
 '01812-555666',
 'jalal@email.com',
 'Rajshahi, Bangladesh');


-- =========================================================
-- 6. ADMIN DATA
-- =========================================================

INSERT INTO Admin
(name, email, password)
VALUES

('System Admin',
 'admin@bloodbank.org',
 'hashed_pass_admin1'),

('Reza Khan',
 'reza.khan@bloodbank.org',
 'hashed_pass_reza'),

('Mitu Sarker',
 'mitu.s@bloodbank.org',
 'hashed_pass_mitu');


-- =========================================================
-- 7. DONATION DATA
-- =========================================================

INSERT INTO Donation
(donor_id, blood_group_id, donation_date, quantity)
VALUES

(1, 1, '2026-07-12', 450),
(2, 3, '2026-08-15', 450),
(3, 7, '2026-06-10', 350),
(4, 7, '2026-03-20', 350),
(5, 5, '2026-05-01', 450),
(1, 1, '2026-04-10', 450),
(6, 2, '2026-02-20', 400);


-- =========================================================
-- 8. BLOOD INVENTORY DATA
-- =========================================================

INSERT INTO Blood_Inventory
(blood_group_id, hospital_id, quantity, last_updated)
VALUES

(1, 1, 2700, '2026-09-25 09:00:00'),
(3, 1, 1800, '2026-09-25 09:00:00'),
(7, 2, 3600, '2026-09-25 10:30:00'),
(5, 2, 900,  '2026-09-25 10:30:00'),
(8, 3, 1350, '2026-09-26 08:00:00'),
(2, 1, 800,  '2026-09-26 09:30:00'),
(7, 1, 2200, '2026-09-26 11:00:00'),
(4, 3, 650,  '2026-09-27 08:30:00');


-- =========================================================
-- 9. BLOOD REQUEST DATA
-- =========================================================

INSERT INTO Blood_Request
(recipient_id, hospital_id, blood_group_id,
 request_date, quantity, status, request_type)
VALUES

(1, 1, 1,
 '2026-08-01', 450, 'Fulfilled', 'Normal'),

(2, 2, 3,
 '2026-08-10', 350, 'Approved', 'Normal'),

(3, 3, 7,
 '2026-09-05', 450, 'Pending', 'Emergency'),

(4, 1, 5,
 '2026-09-08', 450, 'Rejected', 'Normal'),

(5, 2, 8,
 '2026-09-13', 350, 'Pending', 'Emergency'),

(1, 3, 7,
 '2026-09-20', 450, 'Pending', 'Normal');


-- =========================================================
-- 10. APPOINTMENT DATA
-- =========================================================

INSERT INTO Appointment
(donor_id, center_id, appointment_date, status)
VALUES

(1, 1, '2026-10-12', 'Scheduled'),
(2, 2, '2026-11-15', 'Scheduled'),
(4, 1, '2026-09-17', 'Completed'),
(5, 3, '2026-08-10', 'Completed'),
(6, 2, '2026-10-05', 'Scheduled'),
(7, 4, '2026-10-08', 'Scheduled');


-- =========================================================
-- 11. USER DATA
-- =========================================================

INSERT INTO User
(name, email, password, role, status)
VALUES

('Arif Hossain',
 'arif.user@email.com',
 'hashed_user_arif',
 'Donor',
 'Active'),

('Sadia Islam',
 'sadia.user@email.com',
 'hashed_user_sadia',
 'Donor',
 'Active'),

('Mehedi Hassan',
 'mehedi.user@email.com',
 'hashed_user_mehedi',
 'Recipient',
 'Active'),

('Fatema Begum',
 'fatema.user@email.com',
 'hashed_user_fatema',
 'Recipient',
 'Active'),

('System Admin',
 'admin.user@bloodbank.org',
 'hashed_admin',
 'Admin',
 'Active');


-- =========================================================
-- 12. BLOOD CAMP DATA
-- =========================================================

INSERT INTO Blood_Camp
(camp_name, camp_date, location, organizer, contact, description, status)
VALUES

('Annual Blood Donation Camp 2026',
 '2026-10-20',
 'Dhanmondi, Dhaka',
 'Red Crescent Bangladesh',
 '01711-111111',
 'Annual voluntary blood donation campaign.',
 'Upcoming'),

('University Blood Donation Camp',
 '2026-10-25',
 'Dhaka University',
 'Sandhani',
 '01711-222222',
 'Blood donation campaign for students and staff.',
 'Upcoming'),

('Winter Blood Donation Camp',
 '2026-11-15',
 'Mirpur, Dhaka',
 'Quantum Foundation',
 '01711-333333',
 'Community blood donation program.',
 'Upcoming'),

('Chittagong Blood Camp',
 '2026-10-30',
 'Agrabad, Chittagong',
 'Red Crescent',
 '01711-444444',
 'Regional blood collection campaign.',
 'Upcoming');


-- =========================================================
-- 13. BLOOD TEST DATA
-- =========================================================

INSERT INTO Blood_Test
(donation_id, test_date,
 hiv_status, hepatitis_status, syphilis_status, blood_test_result)
VALUES

(1, '2026-07-13',
 'Negative', 'Negative', 'Negative', 'Safe'),

(2, '2026-08-16',
 'Negative', 'Negative', 'Negative', 'Safe'),

(3, '2026-06-11',
 'Negative', 'Negative', 'Negative', 'Safe'),

(4, '2026-03-21',
 'Negative', 'Negative', 'Negative', 'Safe'),

(5, '2026-05-02',
 'Negative', 'Negative', 'Negative', 'Safe'),

(6, '2026-04-11',
 'Negative', 'Negative', 'Negative', 'Safe'),

(7, '2026-02-21',
 'Negative', 'Negative', 'Negative', 'Safe');


-- =========================================================
-- 14. STAFF DATA
-- =========================================================

INSERT INTO Staff
(hospital_id, name, email, phone, position)
VALUES

(1,
 'Dr. Mahfuz Rahman',
 'mahfuz@dmch.gov.bd',
 '01911-100001',
 'Doctor'),

(1,
 'Nadia Sultana',
 'nadia@dmch.gov.bd',
 '01911-100002',
 'Nurse'),

(2,
 'Dr. Fahim Ahmed',
 'fahim@squarehospital.com',
 '01911-100003',
 'Doctor'),

(2,
 'Mim Akter',
 'mim@squarehospital.com',
 '01911-100004',
 'Blood Technician'),

(3,
 'Dr. Saiful Islam',
 'saiful@cgh.gov.bd',
 '01911-100005',
 'Doctor');


-- =========================================================
-- 15. BLOOD CAMP REGISTRATION DATA
-- =========================================================

INSERT INTO Blood_Camp_Registration
(camp_id, donor_id, registration_date, status)
VALUES

(1, 4, '2026-09-20', 'Registered'),
(1, 6, '2026-09-21', 'Registered'),
(2, 1, '2026-09-22', 'Registered'),
(2, 2, '2026-09-22', 'Registered'),
(3, 5, '2026-09-23', 'Registered'),
(4, 7, '2026-09-24', 'Registered');


-- =========================================================
-- END OF DATABASE
-- =========================================================
