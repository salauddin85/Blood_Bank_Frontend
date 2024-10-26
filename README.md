# Blood Bank Project

Welcome to the Blood Bank Project! This application serves as a platform for connecting donors and recipients, facilitating blood donation requests, and managing notifications effectively.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**
  - User registration, login, and logout functionality.
  - Profile viewing and updating.
  - Password change option.

- **Donation Notifications**
  - Users can send notifications for blood requests.
  - Active users can create events based on notifications.
  - Users can view available notifications.

- **Blog and Reviews**
  - Users can add blogs related to their donation experiences.
  - Users can leave reviews on their donation experiences.

- **Admin Management**
  - Admin can manage donors and recipients.
  - Full blood bank management capabilities.
  - Accept or cancel donation requests.

## API Endpoints

### Authentication
- **Register:**  
  `POST https://blood-bank-deploy-vercel.vercel.app/auth/register/`
- **Login:**  
  `POST https://blood-bank-deploy-vercel.vercel.app/auth/login/`
- **Logout:**  
  `POST https://blood-bank-deploy-vercel.vercel.app/auth/logout/`

### Donor Features
- **Notifications:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/events/notifications/`
- **Request User Donation Events:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/events/donation-events/`
- **Donation History:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/events/donation-history/`
- **All Donation Events:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/events/dashboard/`
- **Without Request User:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/events/dashboard/recipient_requests/`
- **All Donation History:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/events/dashboard/donation_history/`

### Other Features
- **About Us:**  
  `GET https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/about-us/`
- **Contact:**  
  `GET https://blood-bank-deploy-vercel.app/blood_bank_releted/contact/`
- **Blog:**  
  `GET https://blood-bank-deploy-vercel.app/blood_bank_releted/blog/`
- **Feedback:**  
  `POST https://blood-bank-deploy-vercel.app/blood_bank_releted/feedback/`
- **All Feedback:**  
  `GET https://blood-bank-deploy-vercel.app/blood_bank_releted/all_feedback/`
- **Subscriptions:**  
  `GET https://blood-bank-deploy-vercel.app/blood_bank_releted/subscriptions/`

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blood-bank-project.git
