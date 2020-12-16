# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def welcome
    UserMailer.with(user: User.all.sample).welcome
  end

  def forgot_pass
    UserMailer.with(user: User.all.sample).forgot_pass
  end
end
