# frozen_string_literal: true

module Parsers
  ###
  # @description: This class is responsible for converting the specifications format to be json-ld
  #   We support RFD, XML, JSON formats, but internally we only work with json-ld, so we need to
  #   work with data in this format and this class will manage the conversion for us.
  #
  # @TODO this is a hook to integrate the conversion of file formats work. delete this comment when
  #   the integration is completed
  ###
  class FormatConverter
    ###
    # @description:
    # @param [ActionDispatch::Http::UploadedFile]: the file to be converted
    # @return [Struct]
    ###
    def self.convert_to_jsonld file
      File.read(file)
    end
  end
end
