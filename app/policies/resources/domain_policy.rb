# frozen_string_literal: true

module Resources
  class DomainPolicy < ApplicationPolicy
    def show?
      signed_in?
    end

    class Scope < ApplicationPolicy::Scope
      def resolve
        user.configuration_profile&.domains || Domain.none
      end
    end
  end
end
