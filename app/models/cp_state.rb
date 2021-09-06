# frozen_string_literal: true

module CpState
  class InvalidStateTransition < StandardError; end
  class NotYetReadyForTransition < StandardError; end
  class ConfigurationProfileStructureError < StandardError; end

  class Base
    def initialize configuration_profile
      @configuration_profile = configuration_profile
    end

    def activate!
      raise NotImplementedError
    end

    def complete!
      raise NotImplementedError
    end

    def deactivate!
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
    def activate!
      raise CpState::InvalidStateTransition, "Already activated"
    end

    def complete!
      raise CpState::InvalidStateTransition, "Can not complete while active"
    end

    def deactivate!
      @configuration_profile.transition_to! :deactivated
    end
  end

  class Complete < Base
    def activate!
      raise CpState::ConfigurationProfileStructureError unless @configuration_profile.generate_structure

      @configuration_profile.transition_to! :active
    end

    def complete!
      raise CpState::InvalidStateTransition, "Already completed"
    end

    def deactivate!
      raise CpState::InvalidStateTransition, "Can not deactivate while complete"
    end
  end

  class Deactivated < Base
    def activate!
      @configuration_profile.transition_to! :active
    end

    def complete!
      raise CpState::InvalidStateTransition, "Can not activate while deactivated"
    end

    def deactivate!
      raise CpState::InvalidStateTransition, "Already deactivated"
    end
  end

  class Incomplete < Base
    def activate!
      raise CpState::InvalidStateTransition, "Can not activate while incomplete"
    end

    def complete!
      raise CpState::NotYetReadyForTransition unless @configuration_profile.structure_complete?

      @configuration_profile.transition_to! :complete
    end

    def deactivate!
      raise CpState::InvalidStateTransition, "Can not deactivate while incomplete"
    end
  end
end
