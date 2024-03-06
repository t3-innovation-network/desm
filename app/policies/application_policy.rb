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

    # Signed in users
    raise Pundit::NotAuthorizedError unless user.present?
  end

  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    true
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    true
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    true
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    true
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    true
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

  private

  def admin_role?
    @user.user.super_admin?
  end

  def signed_in?
    @user.user.present?
  end
end
