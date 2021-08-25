default_pass = ENV["DEFAULT_PASS"]

User.seed(:fullname, 
  {
  fullname: "admin",
  email: "admin@desmsolutions.org",
  password: default_pass,
  organization: Organization.first,
  skip_sending_welcome_email: true
  }
)
