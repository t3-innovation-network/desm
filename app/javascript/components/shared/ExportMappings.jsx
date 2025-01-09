import { useCallback, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import downloadExportedMappings from '../../services/downloadExportedMappings';
import { processMessage } from '../../services/api/apiService';

const FORMAT_OPTIONS = { jsonld: 'JSON-LD', ttl: 'Turtle', csv: 'CSV' };

const ExportMappings = ({ configurationProfile, domains, onError }) => {
  const [downloading, setDownloading] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('jsonld');

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setDownloading(true);

      try {
        await downloadExportedMappings({
          configurationProfile,
          domainIds: selectedDomains.map((d) => d.value),
          format: selectedFormat,
        });
      } catch (e) {
        onError?.(processMessage(e));
      }

      setDownloading(false);
    },
    [downloadExportedMappings, selectedDomains, selectedFormat, setDownloading]
  );

  return (
    <form className="row" onSubmit={handleSubmit}>
      <label className="form-label">Export mappings from domains:</label>
      <div className="col-12 mb-2">
        <MultiSelect
          disabled={downloading}
          labelledBy="Select domains"
          onChange={setSelectedDomains}
          options={domains.map((d) => ({ label: d.name, value: d.id }))}
          value={selectedDomains}
        />
      </div>
      <label className="form-label">AS</label>
      <div className="col-12 d-flex gap-2">
        <select
          className="form-select w-75"
          onChange={(e) => setSelectedFormat(e.target.value)}
          value={selectedFormat}
        >
          {Object.entries(FORMAT_OPTIONS).map(([format, label]) => (
            <option key={format} value={format}>
              {label}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary flex-grow-1"
          disabled={downloading || !selectedDomains.length}
          type="submit"
        >
          Export
        </button>
      </div>
    </form>
  );
};

export default ExportMappings;
