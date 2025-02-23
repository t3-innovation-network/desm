# frozen_string_literal: true

require "zaru"

module FsSanitizable
  def ary_to_filename(ary)
    sanitized_filename_for(ary.compact_blank.map { _1.split.join("+") }.join("_"))
  end

  def sanitized_filename_for(filename)
    ::Zaru.sanitize!(filename).gsub(/_+/, "_")
  end

  def timestamp_for(date_at)
    date_at.to_s.gsub(/[^\d]/, "")
  end
end
