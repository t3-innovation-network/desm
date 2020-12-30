
# Welcome!

![T3 Innovation Network Logo](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273002/t3-desm/T3Logo_lv3xpn.png)

To start using the application, an administrator will have to add the user to the tool using the dashboard.
When this process is complete, the user will receive a welcome email like in the image below:

## Welcome email  

![Welcome email](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609272462/t3-desm/welcome-email_wucjjk.png)

If the user clicks in the Sign in button, it will redirect it to the sign in page.
If the administrator shares the default password the user can use that one. Otherwise, the user can click in the
"Forgot Password" link, and it will redirect the user to the screen to reset the password.

## Forgot Password Screen

![Forgot password screen](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273169/t3-desm/forgot-password-screen_dmnay8.png)

When the user fills the input with the correct email, it will receive an email with instructions on how to
reset its password. The email looks like the image below:

## Forgot Password Email

![Forgot password email](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609272462/t3-desm/forgot-password-email_sio9bw.png)
 
After clicking in the reset password link inside the email, the user is redirected to the reset password screen
with a secret token (managed under the hood by the application to ensure the user that the only person that can
reset its password is someone with access to its email).

## Reset Password Screen

![Reset password screen](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273339/t3-desm/reset-password-screen_woyn9y.png)

In the reset password screen, the user is able to selected a new password. This password is validated to be strong
using an entropy based algorithm. It means that the password is acceptable when it passes a determined number in
deductibility measure. The combination of lowercase, uppercase characters, numbers and symbols, plus a minimum
length of 8 characters can help building a strong password.

## And that's it!

Now the user is able to access the tool by using the email and the new generated password.

> Continue reading ...
- [Previous - Adding a user](https://github.com/t3-innovation-network/desm/tree/master/walkthrough/0-adding-a-user.md)
- [Next - Uploading a file](https://github.com/t3-innovation-network/desm/tree/master/walkthrough/2-uploading-a-file.md)
- [Back to the main Readme file](https://github.com/t3-innovation-network/desm)