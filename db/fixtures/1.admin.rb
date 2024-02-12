User.seed(:fullname,
  {
  fullname: "admin",
  email: "admin@desmsolutions.org",
  password: Desm::DEFAULT_PASS,
  skip_sending_welcome_email: true
  }
)
