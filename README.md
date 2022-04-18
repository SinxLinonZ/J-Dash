# J-Dash
This is a alternative application to the **shitty UNIPA** application for the UNIVERSAL PASSPORT system.
 
![Screenshot](/assets/screenshot.png)

# Why this app?
Not only the overwhelmingly bad review of the UNIPA application, but also the fact that the UNIPA application is so difficult to use. 

The app itself contains some API call to display data, the remaining functions are just a webview for the UNIVERSAL PASSWORD page which could just be opened in the browser. The app itself doesn't provide any convenience.

Here's some of the reviews:

![Review 1](/assets/reviews/review_appstore_1.png)
![Review 2](/assets/reviews/review_appstore_2.png)
![Review 3](/assets/reviews/review_googleplay_1.png)

# What is J-Dash?
This project is developed by NetTech group(SinxLinonZ / h-kys) of Tokyo University of Information Science(TUIS). 

From the very beginning, this application is considered only for the education system in TUIS which called J-Port. But after a few digging, I found that this application actually supports all UNIVERSAL PASSPORT system in theory.

So generally, this application works on all UNIVERSAL PASSPORT based system. But this is not guaranteed. You have to specify the API call point in the `.env` file.

# How to use
## Dependencies
- Node.JS

## Preparation
- copy `.env.example` to `.env`
- fill the `.env` file with hostname and API call point

## Local deployment
```
npm install
PORT=3000 node index.js
```

## Author deplyment
For students of TUIS, you can directly access https://junk.h-kys.com/j-dash/ to use the service.

Make sure you have read the term of service and disclaimer before using this service.


# Disclaimer
```
but does not record or store all personalinformation including it.
In the unlikely event that the password is leaked, 
this application and the creator of this application cannot be held responsible.

In principle, this application works for systems that are UNIVERSAL PASSPORT,
but we do not guarantee that it will work 100%.

This application was developed for the purpose of learning and knowledge sharing, 
and the creator of this application and this application cannot be held responsible 
for any troubles caused by using API EntryPoint for the UNIVERSAL PASSPORT system.

Many functions such as attendance and syllabus inquiry are realized by operating UNIVERSAL
PASSPORT
on behalf of the user, but the accuracy of the data displayed by this application is not
guaranteed.
The application and the creator of this application cannot be held responsible for any troubles
such
as omission of attendance or syllabus deviation due to the use of this application.
After using it, please check with the UNIVERSAL PASSPORT by yourself.

This application may be discontinued at any time due to unexpected causes.
All data is owned by UNIVERSAL PASSPORT.

Please be aware of the above before using this application.
```

# Terms of service
```
This application was created by an individual and hosted on an individual server.
Due to the poor server, a temporary communication failure may occur 
depending on the amount of access.

This application can be used using the account of 
Tokyo University of Information Sciences J-Port, but all educational system data is 
stored in Tokyo University of Information Sciences J-Port. 
This application has not been saved to the server at all.

When using this application, we guarantee that the account and password 
will be requested only for the first time, and that all user information including 
that information is not stored or recorded on the server of this application.
(However, because we use cookies, if you exceed the last usage time of this application
for 10 days, the cookie will expire and you may be billed again.)
(However, in order to prevent unauthorized use and intrusion, 
we will keep the access log excluding personal information.)
All user data required by the application is stored in the user's terminal 
in the form of a cookie.
If you have any concerns about personal data, you can browse the source code 
of this application in the following repository.
If you still have any concerns after reading the source code, 
using this application is not recommanded.
GitHub: https://github.com/SinxLinonZ/J-Dash

Also, if you have any opinions, corrections, or problems with the application, please use the GitHub
Issue, not email.

Since it is developed and managed by an individual, changes in page layout and functions may occur
at any time.

Please be aware of the above before using this application.
```


# API References
*NOTE: A large part of the API parameter & return data are the raw data from the UNIVERSAL PASSPORT system. Which is not well organized I know, but hey...*

## POST `/api/login`
```
Parameters:
    username: string of username which used to login to
              the UNIVERSAL PASSPORT
    password: plain text of password
    URIEncode?: boolean, default is true. If is false, 
                the encrypted password returned will be 
                URIDecoded as a base64 string

Return:
    JSON of login result. Will contain encrypted password 
    if success.
```

## POST `/api/schedule`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)
    semester?: semester, default is 0 (current)
    term?: term, default is 0 (current)

Return:
    JSON data of specified semester/term schedule. 
    list data are represented in returnData.schedule
```

## POST `/api/lectureStatus`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)
    lecture:  the raw lecture data which return from 
              `/api/schedule`

Return:
    JSON data of the lecture status. Almost attendance data.
```

## POST `/api/homeUrl`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)

Return:
    String URL data leading to the phone mode homepage,
    which use query to login (you don't need to login 
    manually)
```

## POST `/api/attendance`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)
    code:     string, the attendance code of the lecture

Return:
    a base64 png screenshot of the attendance page
```

## POST `/api/lectureSyllabus`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)
    lecture:  the raw lecture data which return from 
              `/api/schedule`

Return:
    String URL data leading to the specified lecture 
    syllabus page
```

## POST `/api/notification/url`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)

Return:
    String URL data leading to the notification page
```

## POST `/api/notification/unreadCount`
```
Parameters:
    username: string of username
    password: encrypted password string (URI encoded)

Return:
    String data of unread notification count
```