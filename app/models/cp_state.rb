# frozen_string_literal: true

module CpState
  class InvalidStateTransition < StandardError; end
  class Base
    def initialize configuration_profile
      @configuration_profile = configuration_profile
    end

    def activate
      raise NotImplementedError
    end

    def complete
      raise NotImplementedError
    end

    def deactivate
      raise NotImplementedError
    end

    def export
      @configuration_profile.structure
    end

    def remove
      @configuration_profile.destroy!
    end
  end

  class Active < Base
    def activate
      raise CpState::InvalidStateTransition, "Already activated"
    end

    def complete
      raise CpState::InvalidStateTransition, "Can not complete while active"
    end

    def deactivate
      @configuration_profile.state_class = 1
    end
  end

  class Complete < Base
    def activate
      @configuration_profile.state_class = 2
      # @todo: generate all the models following the structure
    end

    def complete
      raise CpState::InvalidStateTransition, "Already completed"
    end

    def deactivate
      raise CpState::InvalidStateTransition, "Can not deactivate while complete"
    end
  end

  class Incomplete < Base
    def activate
      raise CpState::InvalidStateTransition, "Can not activate while incomplete"
    end

    def complete
      @configuration_profile.state_class = 1 if schema_completed?
    end

    def deactivate
      raise CpState::InvalidStateTransition, "Can not deactivate while incomplete"
    end

    private

    def schema_completed?
      true # @todo: validate cp structure against json schema
    end
  end
end
