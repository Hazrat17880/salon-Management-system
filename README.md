This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Table for main admin 
CREATE TABLE IF NOT EXISTS salon_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


# adding service table 
CREATE TABLE IF NOT EXISTS salon_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL, -- FK to salon table
    salon_name VARCHAR(255) NOT NULL,
    main_category ENUM('male', 'female', 'unisex') NOT NULL,
    sub_category VARCHAR(100) NOT NULL, -- e.g. Hair Cutting, Facewash, Manicure
    title VARCHAR(255) NOT NULL, -- Detailed service title
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0.00, -- % discount
    special_days VARCHAR(255), -- e.g. 'Monday, Wednesday, Friday'
    available_start_time TIME, -- e.g. 10:00:00
    available_end_time TIME,   -- e.g. 12:00:00
    duration_minutes INT DEFAULT 30, -- service duration in minutes
    image_url VARCHAR(255), -- optional image for display
    status ENUM('active', 'inactive') DEFAULT 'active', -- for availability
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FCREATE TABLE IF NOT EXISTS salon_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    salon_name VARCHAR(255) NOT NULL,
    main_category ENUM('male', 'female', 'unisex') NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0.00,
    special_days VARCHAR(255),
    available_start_time TIME,
    available_end_time TIME,
    duration_minutes INT DEFAULT 30,
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    
    user_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    user_email VARCHAR(255) NOT NULL,

   
    salon_id INT NOT NULL,
    salon_name VARCHAR(255) NOT NULL,

    
    service_id INT NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    service_discount DECIMAL(5,2) DEFAULT 0.00,
    

    
    appointment_date DATE NOT NULL,
    appointment_start_time TIME NOT NULL,
    appointment_end_time TIME NOT NULL,

    
    check_in_status ENUM('not_checked', 'checked_in', 'no_show') DEFAULT 'not_checked',
    check_in_time DATETIME DEFAULT NULL,
    check_in_notes TEXT,


    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    payment_method ENUM('credit_card', 'online') DEFAULT 'online',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES salon_services(id) ON DELETE CASCADE,
    FOREIGN KEY (check_in_by) REFERENCES salon_staff(id) ON DELETE SET NULL
);



-- appointment_details : store basic user, salon, service, and appointment info
CREATE TABLE IF NOT EXISTS appointment_details (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,

    
    salon_id INT NOT NULL,
    salon_name VARCHAR(255) NOT NULL,

    
    service_id INT NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,

   
    appointment_id INT NOT NULL,
    appointment_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES salon_services(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);


# complaints : when a user submits a complaint about a service or appointment
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,

   
    user_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),

    
    salon_id INT NOT NULL,
    salon_name VARCHAR(255) NOT NULL,

    
    complaint_text TEXT NOT NULL,
    complaint_image VARCHAR(255),
    complaint_status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES salon_services(id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);


# a message table that's a salon can send to the admin panel and admin can send to the salons

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    sender_id INT NOT NULL,
    sender_role ENUM('admin', 'salon')
    receiver_id INT NOT NULL,  
    receiver_role ENUM('admin', 'salon') NOT NULL,

    message_text TEXT,            -- text message (optional if sending image only)
    message_image VARCHAR(255),   -- store image file path or URL

    message_status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


# a plateform base notification that can send by admin panel 
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    image_url VARCHAR(255),     

    target_audience ENUM('all', 'salons', 'users') DEFAULT 'all',
    send_method ENUM('sms', 'email', 'push', 'in_app') NOT NULL,

    sent_by_admin_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    
);
