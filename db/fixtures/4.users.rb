User.seed(:fullname, 
  {
  fullname: "mapper 1",
  email: "mapper1@desmsolutions.org",
  password: Desm::DEFAULT_PASS,
  organization: Organization.first,
  skip_sending_welcome_email: true
  },
  {
  fullname: "mapper 2",
  email: "mapper2@desmsolutions.org",
  password: Desm::DEFAULT_PASS,
  organization: Organization.first,
  skip_sending_welcome_email: true
  },
)
