admin_user = User.first

ConfigurationProfile.seed do |cp|
    cp.name = "Test Configuration Profile"
    cp.description = "A 'Configuration Profile' with testing purposes. You can edit this to meet your needs or replace it with a new one."
    cp.state = 2
    cp.administrator = admin_user
end