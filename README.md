![thumbnail](./gym-management.png)

# Gym Management System Documentation

The Gym Management System is a web application designed to facilitate the management of a fitness center or gym. It provides various features for different user roles including administrators, trainers, and students.

## Features

The Gym Management System includes the following features:

- Authentication and Authorization
- User-specific Dashboards
- User Profile Management
- User Management (Admins and Trainers)
- Trainers and Students Listings
- Attendance Tracking
- Exercise and Diet Management
- Fees Tracking and Payment
- Notifications
- Responsive Design

## Installation

```Clone the repository: git clone https://github.com/TajwarSaiyeed/gym-management-system.git```

```Install dependencies: cd gym-management-system && npm install```


Create a `.env.local` file in the root directory and add your environment variables:

```
DATABASE_URL =<your_mongodb_uri>
NEXTAUTH_SECRET=<next_auth_secret>
NODE_ENV="development"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your_cloudname>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
NEXT_PUBLIC_STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Table of Contents

1. [Introduction](#introduction)
2. [Authentication Pages](#authentication-pages)
3. [Dashboard Pages](#dashboard-pages)
4. [User Profile Pages](#user-profile-pages)
5. [User Management Pages](#user-management-pages)
6. [Trainers and Students Pages](#trainers-and-students-pages)
7. [Attendance Pages](#attendance-pages)
8. [Exercise and Diet Pages](#exercise-and-diet-pages)
9. [Fees Pages](#fees-pages)
10. [Notification Page](#notification-page)
11. [Deploy](#deploy)



This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Introduction <a name="introduction"></a>

The Gym Management System is a comprehensive web application designed to facilitate the management of a fitness center or gym. It offers a range of features for different user roles, including administrators, trainers, and students. This documentation provides an overview of the various pages and functionalities available in the system.

The Gym Management System repository can be found here: [GitHub Repository](https://github.com/TajwarSaiyeed/gym-management-system)

## Authentication Pages <a name="authentication-pages"></a>

### 1. Sign in Page

Description: Users can access their accounts by providing the correct email and password. Limited to authorized users.
Features:
- No sign-up system
- Authentication using correct email and password
- Utilizes Next-Auth for authentication
- Access protected pages
  Access Role: Public

## Dashboard Pages <a name="dashboard-pages"></a>

### 2. Admin Dashboard Page

Description: Admin can see various statistics and graphs related to user activity, attendance, and fees.
Features:
- Total Users, Trainers, Students
- Online Users
- Paid and Unpaid Fees
- Activity Status
- Attendance Graph
  Access Role: Admin

### 3. Trainer Dashboard Page

Description: Trainers can view statistics and graphs related to user activity and attendance.
Features:
- Total Users, Trainers, Students
- Online Users
- Activity Status
- Attendance Graph
  Access Role: Trainer

### 4. Student Dashboard Page

Description: Students can view their fees status, attendance graph, and activity status.
Features:
- Fees Status
- Activity Status
- Attendance Graph
  Access Role: Student

## User Profile Pages <a name="user-profile-pages"></a>

### 5. Profile Page

Description: Users can view and update their profile details, including images and personal information.
Features:
- View all details
- Update Profile Image
- Update Personal Data
- Change Password
- Cannot change email, gender, or user role
  Access Role: Logged-in User

### 6. Trainer Page

Description: Admins, trainers, and students can view detailed information about trainers.
Features:
- View trainer details
- Trainer's All Data
- Trainer's Image
- Access Server Page
  Access Role: Admin, Trainer, Student

### 7. Student Page

Description: Admins and trainers can view detailed information about students.
Features:
- View student details
- Student's All Data
- Student's Image
- Access Server Page
  Access Role: Admin, Trainer

## User Management Pages <a name="user-management-pages"></a>

### 8. Add Member Page

Description: Admins can add both trainers and students, while trainers can only add students.
Features:
- Admin can add trainers and students
- Trainers can add only students
- Image Upload to Cloudinary
- User Name, Email, Password
- Age, Weight, Height
- User Goal, User Level
  Access Role: Admin, Trainer

### 9. Manage User Page

Description: Admin can view, update, and delete user profiles and can assign trainers to students.
Features:
- See All Users
- Delete User
- Update User
- Assign Trainer to Students
  Access Role: Admin

## Trainers and Students Pages <a name="trainers-and-students-pages"></a>

### 10. Trainers Page

Description: Admins, trainers, and students can view a list of trainers with pagination support.
Features:
- List of trainers
- Pagination
  Access Role: Admin, Trainer, Student

### 11. Students Page

Description: Admins and trainers can view a list of students with pagination support.
Features:
- List of students
- Pagination
  Access Role: Admin, Trainer

## Attendance Pages <a name="attendance-pages"></a>

### 12. Attendance Page

Description: Admins and trainers can create and monitor student attendance.
Features:
- Create attendance
- Monitor attendance
- Table view of all attendance
  Access Role: Admin, Trainer

### 13. Student Attendance Page

Description: Students can view their attendance and mark their daily attendance.
Features:
- See Attendance
- Mark Attendance
- No late attendance allowed
  Access Role: Student

## Exercise and Diet Pages <a name="exercise-and-diet-pages"></a>

### 14. Manage Exercise Page

Description: Admins and trainers can manage exercises, including adding, viewing, and deleting.
Features:
- Add Exercise
- See All Exercises
- Delete Exercise
  Access Role: Admin, Trainer

### 15. Assign Exercise Page

Description: Admins and trainers can assign exercises to students with details like time period and sets.
Features:
- Select users
- Assign/Update Exercise to users
- Add Time, Sets, Steps, kg, Rest time for each exercise
  Access Role: Admin, Trainer

### 16. Manage Diet Food Page

Description: Admins and trainers can manage foods, including adding, viewing, and deleting.
Features:
- Add Food
- See All Foods
- Delete Food
  Access Role: Admin, Trainer

### 17. Assign Diet Sheet Page

Description: Admins and trainers can assign diet sheets to students with details like time period and meals.
Features:
- Select users
- Assign/Update diet sheet to users
- Checkmark food for different meals
  Access Role: Admin, Trainer

### 18. Student Exercise Page

Description: Students can view their exercise routines, including details about each exercise.
Features:
- View Exercise Routines
- See Time Periods, Sets, Steps, kg, Rest Time
  Access Role: Student

### 19. Student Diet Sheet Page

Description: Students can access their diet sheets, including details about each meal.
Features:
- Access Diet Sheets
- See Time Periods, Food for Different Meals
  Access Role: Student

## Fees Pages <a name="fees-pages"></a>

### 20. Fees Page

Description: Admins and trainers can add, track, and send reminders for student fees.
Features:
- Add Fees
- Send Fee Notifications
- Track Fees Status
- Send Fee Reminders
  Access Role: Admin, Trainer

### 21. Student Fees Page

Description: Students can view their fees status, pay fees, and see fees history.
Features:
- See Fees Status
- Pay Fees
- See Fees History
  Access Role: Student

### 22. Student Fees Stripe Checkout Page

Description: Students can conveniently pay fees using Stripe checkout with various card options.
Features:
- Pay Fees via Stripe Checkout
- Support for credit cards, debit cards, etc.
  Access Role: Student

### 23. Student Payment Success Page

Description: After making a fee payment, students will see a payment success page with details.
Features:
- View Payment Details
- See Billing Information
- Check Payment Method
- Download Receipt
  Access Role: Student

## Notification Page <a name="notification-page"></a>

### 24. Notification Page

Description: Users can send, view, and manage notifications.
Features:
- Send Notifications
- View Notifications
- Mark Notifications as Read
- Navigate to Relevant Pages from Notifications
  Access Role: Admin, Trainer, Student

This documentation provides an overview of the various pages, features, and functionalities available in the Gym Management System. For detailed usage instructions and implementation details, please refer to the [GitHub Repository](https://github.com/TajwarSaiyeed/gym-management-system).


## Deploy on Vercel <a name="deploy"></a>

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Documentation

For detailed information about each page and functionality, please refer to the [Documentation](#introduction) section.

## Contributing

Contributions to the Gym Management System are welcome! Feel free to fork the repository, create a new branch, and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- This project was inspired by the need for a comprehensive gym management system.
- Special thanks to [TajwarSaiyeed](https://github.com/TajwarSaiyeed) for creating and sharing this project.

For detailed usage instructions and implementation details, please refer to the [GitHub Repository](https://github.com/TajwarSaiyeed/gym-management-system).

