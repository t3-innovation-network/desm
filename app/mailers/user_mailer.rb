# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: "r.richard0000@gmail.com"

  def welcome
    @user = params[:user]
    @url = "http://localhost:3000/sign-in"

    mail(to: @user.email, subject: "Welcome to desmsolutions.org!")
  end
end
