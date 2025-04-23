# frozen_string_literal: true

module Converters
  # Converts an XML Schema specification to the JSON-LD format
  class XmlSchema < Base
    Type = Struct.new(:kind, :value)

    attr_reader :doc

    ##
    # @param file [#path]
    def initialize(file)
      super
      @doc = Nokogiri::XML(File.read(file.path))

      doc.xpath("/xs:schema/xs:complexType | /xs:schema/xs:group").each do |complex_type|
        build_complex_type_resources(complex_type)
      end
    rescue Nokogiri::XML::XPath::SyntaxError => e
      # TODO: check if we need to raise exception here
      Rails.logger.error(e.inspect)
    end

    def self.read(path)
      doc = Nokogiri::XML(File.read(path))
      raise Converters::ParseError if doc.errors.any?

      true
    end

    private

    ##
    # Builds RDF resources from an `xs:complexType`.
    #
    # @param complex_type [Nokogiri::XML::Element]
    def build_complex_type_resources(complex_type)
      complex_type.xpath("./xs:sequence/xs:element").each do |element|
        build_property(element, complex_type)
      end

      complex_type.xpath("./xs:sequence/xs:group").each do |group_ref|
        group = find_element_by_name(group_ref["ref"])
        next unless group

        build_group_resources(group, complex_type)
      end
    end

    ##
    # Builds an `skos:Concept` from an `xs:enumeration`.
    #
    # @param enumeration [Nokogiri::XML::Element]
    # @param scheme_name [String]
    # @return [Hash]
    def build_concept(enumeration, scheme_name)
      value = enumeration["value"]

      concept = {
        "@id": build_desm_uri("#{scheme_name}_#{value}"),
        "@type": "skos:Concept",
        "skos:prefLabel": value,
        "skos:definition": { en: extract_annotation(enumeration) },
        "skos:inScheme": build_desm_uri(scheme_name)
      }

      resources << concept
      concept
    end

    ##
    # Builds an `skos:ConceptScheme` from a named `xs:simpleType` enumeration.
    #
    # @param simple_type [Nokogiri::XML::Element]
    # @return [Hash]
    def build_concept_scheme(simple_type)
      name = simple_type["name"]
      return unless name.present?

      enumerations = simple_type.xpath("./xs:restriction/xs:enumeration")
      return if enumerations.empty?

      concept_ids = enumerations.map do |enumeration|
        build_concept(enumeration, name).fetch(:@id)
      end

      {
        "@id": build_desm_uri(name),
        "@type": "skos:ConceptScheme",
        "dct:title": "#{name.decamelize.capitalize} concept scheme",
        "dct:description": extract_annotation(simple_type),
        "skos:hasTopConcept": concept_ids
      }
    end

    ##
    # Builds a `rdf:Class` from an `xs:complexType`.
    #
    # @param complex_type [Nokogiri::XML::Element]
    # @return [Hash]
    def build_domain_class(complex_type)
      name = complex_type["name"]

      {
        "@id": build_desm_uri(name.upcase_first),
        "@type": "rdf:Class",
        "rdfs:label": name.decamelize,
        "rdfs:comment": extract_annotation(complex_type)
      }
    end

    ##
    # Recursively builds RDF resources from an `xs:group`.
    #
    # @param group [Nokogiri::XML::Element]
    # @param complex_type [Nokogiri::XML::Element]
    # @param parent_groups [Array<Nokogiri::XML::Element>]
    def build_group_resources(group, complex_type, parent_groups = [])
      parent_groups = [*parent_groups, group]

      group.xpath("./xs:sequence/xs:element").each do |element|
        build_property(element, complex_type, parent_groups)
      end

      group.xpath("./xs:sequence/xs:group").each do |group_ref|
        inner_group = find_element_by_name(group_ref["ref"])
        next unless inner_group

        build_group_resources(inner_group, complex_type, parent_groups)
      end
    end

    ##
    # Build an `rdf:Property` and related resources from an `xs:element`.
    #
    # @param element [Nokogiri::XML::Element]
    # @param complex_type [Nokogiri::XML::Element]
    # @param parent_groups [Array<Nokogiri::XML::Element>]
    # @return [Hash]
    #
    def build_property(element, complex_type, parent_groups = [])
      id_prefix = [complex_type, *parent_groups].map { |e| e["name"] }.join("_")
      name = element["name"]
      type = detect_type(element)
      concept_scheme = fetch_concept_scheme(type.value) if type&.kind == :enum

      property = {
        "@id": build_desm_uri("#{id_prefix}_#{name}".lowcase_first),
        "@type": "rdf:Property",
        "rdfs:label": name.decamelize,
        "rdfs:comment": extract_annotation(element),
        "desm:sourcePath": element.path,
        "desm:valueSpace": concept_scheme&.slice(:@id),
        "rdfs:domain": fetch_domain_class(complex_type).slice(:@id),
        "rdfs:range": derive_range(type)
      }

      resources << property
      property
    end

    ##
    # Derives an `rdfs:range` from a type.
    #
    # @param type [Type, nil]
    # @return [Hash, String, nil]
    def derive_range(type)
      case type&.kind
      when :complex
        fetch_domain_class(type.value).slice(:@id)
      when :enum
        "skos:Concept"
      when :literal
        "rdfs:Literal"
      end
    end

    ##
    # Derive a type from a type-defining element.
    #
    # @param element [Nokogiri::XML::Element, nil]
    # @return [Type, nil]
    def derive_type_from_element(element)
      return unless element

      kind =
        if element.name == "complexType" && element["name"].present?
          :complex
        elsif element.at_xpath("./xs:restriction/xs:enumeration")
          :enum
        end

      return Type.new(kind, element) if kind

      detect_type(
        element.at_xpath(
          "./xs:restriction|" \
          "./*[self::xs:complexContent or self::xs:simpleContent]" \
          "/*[self::xs:extension or self::xs:restriction]"
        )
      )
    end

    ##
    # Detect the element's type.
    #
    # @param element [Nokogiri::XML::Element, nil]
    # @return [Type, nil]
    def detect_type(element)
      return unless element

      name = element[element.name == "element" ? "type" : "base"]
      return Type.new(:literal, name) if name&.match?(/^xsd?:/)

      type_element =
        if name.present?
          find_element_by_name(name)
        else
          element.at_xpath("./*[self::xs:complexType or self::xs:simpleType]")
        end

      derive_type_from_element(type_element)
    end

    ##
    # Extracts an English annotation from an `xs:element`.
    # Or an annotation with no language, when there is no English one.
    #
    # @param element [Nokogiri::XML::Element]
    # @return [String, nil]
    def extract_annotation(element)
      documentation = element.at_xpath(
        "./xs:annotation/xs:documentation[starts-with(@xml:lang, 'en')]"
      ) || element.at_xpath(
        "./xs:annotation/xs:documentation[not(@xml:lang)]"
      )

      documentation&.text
    end

    ##
    # Looks for an `xs:element` with a given name.
    #
    # @param name [String]
    # @return [Nokogiri::XML::Element, nil]
    def find_element_by_name(name)
      unprefixed_name = name.split(":").last

      doc.at_xpath(
        format("./xs:schema/*[@name='%<full_name>s' or @name='%<name>s']", full_name: name, name: unprefixed_name)
      )
    end
  end
end
