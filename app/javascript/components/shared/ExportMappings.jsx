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
    <form className="d-flex" onSubmit={handleSubmit}>
      <label className="d-flex align-items-end mr-2">Export mappings from domains:</label>
      <div className="flex-grow-1 mr-2">
        <MultiSelect
          disabled={downloading}
          labelledBy="Select domains"
          onChange={setSelectedDomains}
          options={domains.map((d) => ({ label: d.name, value: d.id }))}
          value={selectedDomains}
        />
      </div>
      <label className="d-flex align-items-end mr-2">as</label>
      <select
        className="form-control mr-2 w-auto"
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
        className="btn btn-primary"
        disabled={downloading || !selectedDomains.length}
        type="submit"
      >
        Export
      </button>
    </form>
  );
};

export default ExportMappings;
