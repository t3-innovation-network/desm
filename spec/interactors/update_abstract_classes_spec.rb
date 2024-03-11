# frozen_string_literal: true

require "rails_helper"

describe UpdateAbstractClasses, type: :interactor do
  describe ".call" do
    let(:json_body) { json_fixture("desmAbstractClasses.json") }

    context "with invalid input" do
      it "rejects creation if json body is not passed" do
        result = described_class.call

        expect(result.error).to eq("json body must be present")
      end

      it "rejects creation if domain set is not passed" do
        result = described_class.call({ json_body: })
        expect(result.error).to eq("domain_set must be present")
      end
    end

    context "with valid input" do
      let(:domain_set) { create(:domain_set) }
      let(:credential_source_uri) { "http://desm.org/concepts/credential" }
      let!(:domain1) { create(:domain, source_uri: credential_source_uri, domain_set:) }
      let!(:domain2) { create(:domain, source_uri: "persisted", domain_set:) }
      let(:subject) { described_class.call({ json_body:, domain_set: }) }

      context "with valid json body" do
        context "when no conflicts in current/new sheme" do
          let!(:domain3) { create(:domain, :with_spine, source_uri: "keep") }

          it "updates the domain set and merge/update with existing domains + removes unused from previous schema" do
            expect { subject }.to change { Domain.count }.from(3).to(9)
            expect(subject.success?).to be_truthy
            expect(subject.domain_set.description).to include "T3 DESM schema"
            expect(subject.domain_set.title).to include "DESM Schema"
            expect(subject.domain_set.source_uri).to eq "http://desm.org/concepts/mappingClasses"
            credential = subject.domain_set.domains.find { |p| p.source_uri == credential_source_uri }
            expect(credential.pref_label).to eq "Credential"
            expect(credential.definition).to include "typically when used to indicate"
          end
        end

        context "there are conflicts in current/new sheme" do
          let!(:domain3) { create(:domain, :with_spine, source_uri: "keep", domain_set:) }

          it "doesn't apply changes and returns error" do
            expect { subject }.not_to change { Domain.count }
            expect(subject.success?).not_to be_truthy
            expect(subject.error).to include domain3.source_uri
            expect(subject.domain_set.description).not_to include "T3 DESM schema"
            expect(subject.domain_set.source_uri).not_to eq "http://desm.org/concepts/mappingClasses"
            credential = subject.domain_set.domains.find { |p| p.source_uri == credential_source_uri }
            expect(credential.definition).not_to include "typically when used to indicate"
          end
        end
      end

      context "with invalid json body" do
        let(:json_body) { "invalid.json" }

        it "returns an error" do
          expect { subject }.not_to change { Domain.count }
          expect(subject.success?).not_to be_truthy
          expect(subject.error).to include "unexpected token"
        end
      end
    end
  end
end
