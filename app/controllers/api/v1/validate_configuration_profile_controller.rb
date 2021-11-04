# frozen_string_literal: true

class Api::V1::ValidateConfigurationProfileController < Api::V1::ConfigurationProfilesAbstractController
  def validate
    render json: {
      validation: ConfigurationProfile::validate_structure(
        permitted_params[:structure].to_h
      )
    }
  end

  private

  def permitted_params
    params.require(:configuration_profile).permit(VALID_PARAMS_LIST)
  end
end
