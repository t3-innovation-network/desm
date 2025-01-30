admin_user = User.first
complete_structure = Rails.root.join("spec", "fixtures", "files", "complete.configuration.profile.json")
json_ac = Rails.root.join("samples", "abstractClasses", "desmAbstractClasses.json")
json_mp = Rails.root.join("samples", "mappingPredicates", "desmMappingPredicates.json")

ConfigurationProfile.seed do |cp|
    cp.name = "Test Configuration Profile"
    cp.description = "A 'Configuration Profile' with testing purposes. You can edit this to meet your needs or replace it with a new one."
    cp.administrator = admin_user
    cp.structure = JSON.parse(File.read(complete_structure))
    cp.json_abstract_classes = JSON.parse(File.read(json_ac))
    cp.json_mapping_predicates = JSON.parse(File.read(json_mp))
end
