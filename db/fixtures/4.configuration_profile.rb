admin_user = User.first
complete_structure = Rails.root.join("spec", "fixtures", "complete.configuration.profile.json")

ConfigurationProfile.seed do |cp|
    cp.name = "Test Configuration Profile"
    cp.description = "A 'Configuration Profile' with testing purposes. You can edit this to meet your needs or replace it with a new one."
    cp.administrator = admin_user
    cp.structure = JSON.parse(File.read(complete_structure))
end

cp = ConfigurationProfile.first
cp.activate!