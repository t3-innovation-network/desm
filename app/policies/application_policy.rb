# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access a
#   determined resource. We can define different policies per resource
#   by inheriting this class
###
class ApplicationPolicy
  attr_reader :user, :record

  ###
  # @description: Initialialize this class with a user and a resource to examine
  ###
  def initialize(user, record)
    @user = user
    @record = record
  end

  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    false
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    false
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    false
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    false
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    false
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end
