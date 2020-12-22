# frozen_string_literal: true

# String extensions
class String
  ##
  # Decamelizes a string keeping uppercase parts intact:
  #   "FooBar" -> "Foo Bar"
  #   "FOOBar" -> "FOO Bar"
  #
  # @return [String]
  def decamelize
    split(/(?=[[:upper:]][[:lower:]])/).join(" ").squish
  end

  ##
  # Downcases the first character.
  #
  # @return [String]
  def lowcase_first
    sub(/^./, &:downcase)
  end
end
