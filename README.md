<img width="1887" height="853" alt="image" src="https://github.com/user-attachments/assets/0485e5f2-e998-43ba-a90f-4bc44a50eeca" />
# Project Overview
= This project is a full-stack Salesforce application designed to manage the complete lifecycle of events including:

- Event & venue management

- Attendee registrations with seat limits and waitlisting

- Speaker scheduling and conflict prevention

- Sponsor onboarding and sponsorship tracking

- Secure online ticket payments (Stripe integration)

- Automated notifications and reminders

- External user access via Experience Cloud

<img width="1296" height="604" alt="image" src="https://github.com/user-attachments/assets/273d49c4-2601-4a8a-917f-95bfb2d6a54f" />
# Tech Stack
- Salesforce Platform

- Apex Classes & Apex Triggers

- SOQL & SOSL

- Lightning Web Components (LWC)

- Salesforce Flows (Record-Triggered, Screen, Scheduled)

- Experience Cloud

- Validation Rules, Formula Fields, Roll-Up Summary Fields


# Development Practices
- Bulkified Apex

- Governor Limit Handling

- Test Classes & Code Coverage
<img width="1819" height="858" alt="image" src="https://github.com/user-attachments/assets/07ae3bae-239c-49ce-b0ea-78fb07972de3" />

# Core Features
# Event & Venue Management

- One venue can host multiple events

- Prevents double-booking of venues for overlapping time slots

- Automatic capacity enforcement based on venue limits


# Attendee Registration & Ticketing

- Event registration via LWC-based UI

- Ticket quantity selection with real-time pricing

- Automatic seat allocation and waitlisting

- Duplicate registration prevention

- Stripe-powered secure payment flow

# Waitlist Automation

- Automatically places attendees on waitlist when capacity is full

- Promotes earliest waitlisted attendee when a confirmed registration is canceled

- Implemented using Apex Triggers & Handler Classes

# Speaker Management

- Many-to-many relationship between events and speakers

- Prevents speakers from being assigned to overlapping events

- Automated email reminders 7 days before event using Scheduled Apex

# Sponsor Management

- Multiple sponsors per event (junction object model)

- Sponsorship amount tracking

- Total sponsorship aggregation per event

# Experience Cloud Portal

- External portal for:

- Attendees

- Speakers

- Sponsors

# Role-based access using Profiles, Permission Sets, and OWD

# Reports & Dashboards

Attendees per event and event type

Seats filled vs capacity

Revenue and sponsorship tracking

Upcoming events dashboards

<img width="1261" height="537" alt="image" src="https://github.com/user-attachments/assets/4f634eae-41d4-46ae-b200-808361cc2a82" />


# Security & Access Control

- Organization-Wide Defaults (OWD) configured per object

- Profile-based and Permission Set–based access

- Field-Level Security for sensitive data (emails, phone numbers, payment info)

- Experience Cloud user access restrictions

# Automation & Notifications

- Scheduled Apex

- Speaker reminders (7 days before event)

# Flows

- Registration validation

- Task creation for coordinators

- Automated email notifications
 
@future methods


Asynchronous email sending

<img width="1873" height="835" alt="image" src="https://github.com/user-attachments/assets/dcbd39b8-3350-4fcd-bde8-488a7fe730d7" />


