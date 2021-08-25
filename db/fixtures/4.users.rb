default_pass = ENV["DEFAULT_PASS"]

User.seed(:fullname, 
  {
  fullname: "mapper 1",
  email: "mapper1@desmsolutions.org",
  password: default_pass,
  organization: Organization.first,
  skip_sending_welcome_email: true
  },
  {
  fullname: "mapper 2",
  email: "mapper2@desmsolutions.org",
  password: default_pass,
  organization: Organization.find(2),
  skip_sending_welcome_email: true
  },
)
