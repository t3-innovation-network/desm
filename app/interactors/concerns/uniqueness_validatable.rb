# frozen_string_literal: true

module UniquenessValidatable
  private

  def check_uniqueness_for(data)
    # Count occurrences of each element
    counts = Hash.new(0)
    data.each { |element| counts[element] += 1 }
    # Select elements with count greater than 1 (i.e., repeated elements)
    counts.select { |_element, count| count > 1 }.keys
  end
end
