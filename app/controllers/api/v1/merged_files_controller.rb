# frozen_string_literal: true

###
# @description: Place all the actions related to specifications
###
module API
  module V1
    class MergedFilesController < BaseController
      before_action :with_instance

      ###
      # @description: Process a specification file to organize and return
      #   the related information, like how many domains it contains
      ###
      def classes
        domains = Processors::Specifications.process_domains_from_file(@instance.content)

        render json: domains
      end

      ###
      # @description: Relies on the converter to first convert each attached file to json-ld. Then merge the
      #   json-ld contents into one only file and save it.
      #   It only returns the id of the saved file, to avoid memory leak. The processing of the following
      #   operations (info, filter) will be performed on the server side.
      ###
      def create
        specs = params[:files].map { |file| Parsers::FormatConverter.convert_to_jsonld(file) }

        @instance = MergedFile.create!(
          content: Processors::Specifications.merge_specs(specs)
        )

        render json: @instance.id
      rescue StandardError => e
        render json: { message: e.message }, status: :internal_server_error
      end

      ###
      # @description: Return a json-ld file with the context and a graph
      #  node with only one class, all it's properties and recursively, all the
      #  related properties
      ###
      def filter
        render json: Processors::Specifications.filter_specification(@instance.content, params[:uris])
      end

      ###
      # @description: Returns the content of a merged file. Needed only when the file is not too large.
      #   Mostly, it will be the case of a single domain file with its properties.
      ###
      def show
        render json: @instance.content
      end
    end
  end
end
