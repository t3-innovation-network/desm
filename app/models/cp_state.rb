# frozen_string_literal: true

module CpState
  class InvalidStateTransition < StandardError; end
  class NotYetReadyForTransition < StandardError; end
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
      @configuration_profile.transition_to! :complete
    end
  end

  class Complete < Base
    def activate!
      @configuration_profile.transition_to! :active
      # @todo: generate all the models following the structure
    end

    def complete!
      raise CpState::InvalidStateTransition, "Already completed"
    end

    def deactivate!
      raise CpState::InvalidStateTransition, "Can not deactivate while complete"
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
