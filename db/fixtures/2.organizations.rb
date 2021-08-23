# Initial Organizations (change to valid ones)
cp = ConfigurationProfile.first

Organization.seed(:name,
  { name: 'Schema.org', email: "info@schema.org", configuration_profile: cp },
  { name: 'CredReg', email: "info@credreg.org", configuration_profile: cp },
  { name: 'CEDS', email: "info@ceds.org", configuration_profile: cp }
)
