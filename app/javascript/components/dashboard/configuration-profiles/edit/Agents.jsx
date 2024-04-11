import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep, pickBy } from 'lodash';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import updateCP from '../../../../services/updateCP';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import { NoDataFound, SmallAddTabBtn, SmallRemovableTab, TabGroup } from '../utils';

const Agents = () => {
  const leadMapperRef = useRef(false);
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];
  const [agentsData, setAgentsData] = useState([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [leadMapper, setLeadMapper] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove agent ${fullname}`;
  const dispatch = useDispatch();

  const initAgentsData = (cp = null) => {
    const dsos = (cp ? cp.structure.standardsOrganizations : getDsos()) || [];
    const dsoAgents = dsos[currentDSOIndex]?.dsoAgents || [];
    setAgentsData(dsoAgents);
    return dsoAgents.length;
  };

  const initAgentData = () => {
    if (currentAgentIndex < 0) return;

    const agent = agentsData[currentAgentIndex];

    if (agent) {
      setFullname(agent.fullname);
      setEmail(agent.email);
      setLeadMapper((leadMapperRef.current = Boolean(agent.leadMapper)));
      setPhone(agent.phone);
      setGithubHandle(agent.githubHandle);
    }
  };

  useEffect(() => {
    const dsoAgentsLength = initAgentsData();
    setCurrentAgentIndex(dsoAgentsLength ? 0 : -1);
    // need to refresh the data to be sure that agent data is updated even if tab index is the same
    setRefresh(!refresh);
  }, [currentDSOIndex]);

  useEffect(() => initAgentData(), [currentAgentIndex, currentDSOIndex, refresh]);

  const addAgent = () => {
    setAgentsData([
      ...agentsData,
      {
        fullname: `Mapper N${agentsData.length + 1}`,
      },
    ]);
    setCurrentAgentIndex(agentsData.length);
  };

  const agentButtons = () => {
    return agentsData.map((agent, idx) => {
      return (
        <SmallRemovableTab
          active={currentAgentIndex === idx}
          key={idx}
          tabClickHandler={() => setCurrentAgentIndex(idx)}
          removeClickHandler={() => {
            setCurrentAgentIndex(idx);
            setConfirmationVisible(true);
          }}
          text={agent.fullname}
          tooltipMsg={"Click to view/edit this user's information"}
        />
      );
    });
  };

  const buildCpData = () => {
    const leadMapper = leadMapperRef.current;
    const localCP = cloneDeep(currentCP);

    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents[currentAgentIndex] = pickBy(
      { email, fullname, githubHandle, phone, leadMapper },
      () => true
    );

    return localCP;
  };

  const saveChanges = () => {
    save(buildCpData())
      .then((data) => {
        const dsoAgentsLength = initAgentsData(data);
        if (currentAgentIndex > dsoAgentsLength - 1) setCurrentAgentIndex(dsoAgentsLength ? 0 : -1);
      })
      .catch(() => {});
  };

  const handleRemoveAgent = () => {
    setConfirmationVisible(false);
    let localCP = cloneDeep(currentCP);
    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents.splice(
      currentAgentIndex,
      1
    );

    save(localCP, { withRefresh: true })
      .then((data) => {
        const dsoAgentsLength = initAgentsData(data);
        setCurrentAgentIndex(dsoAgentsLength ? 0 : -1);
        // need to refresh the data to be sure that agent data is updated even if tab index is the same
        setRefresh(!refresh);
      })
      .catch(() => {});
  };

  const save = (data, options = { withRefresh: false }) => {
    dispatch(setSavingCP(true));

    return updateCP(currentCP.id, data).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(null));
        // need to revert the changes
        if (options.withRefresh) setRefresh(!refresh);
        return Promise.reject(false);
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
      return Promise.resolve(response.configurationProfile);
    });
  };

  const selectedAgentInfo = () => {
    return (
      <div className="col">
        <div className="form-check mt-5">
          <input
            checked={leadMapper}
            className="form-check-input"
            id="leadMapper"
            onChange={(event) => {
              setLeadMapper((leadMapperRef.current = event.target.checked));
              saveChanges();
            }}
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="leadMapper">
            Lead Mapper?
          </label>
          <div className="form-text">Only lead mappers can publish completed mappings.</div>
        </div>

        <div className="mt-5">
          <label htmlFor="name">
            Agent Full Name
            <span className="ml-1 text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              id="name"
              type="text"
              className="form-control input-lg"
              name="fullname"
              placeholder="The name of this agent"
              value={fullname || ''}
              onChange={(event) => {
                setFullname(event.target.value);
              }}
              onBlur={saveChanges}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="email">
            Agent Email
            <span className="ml-1 text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              id="email"
              type="text"
              className="form-control input-lg"
              name="agentEmail"
              placeholder="The email of this agent"
              value={email || ''}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              onBlur={saveChanges}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="phone">Agent Phone</label>
          <div className="input-group input-group">
            <input
              id="phone"
              type="tel"
              pattern="(-()[0-9]+)+$"
              className="form-control input-lg"
              name="agentPhone"
              placeholder="The phone of this agent"
              value={phone || ''}
              onChange={(event) => {
                setPhone(event.target.value);
              }}
              onBlur={saveChanges}
              aria-describedby="phoneHelpBlock"
            />
            <small id="phoneHelpBlock" className="form-text text-muted">
              Phone number should be at least 6 characters long and can contain digits, spaces, or
              hyphens, optionally starting with a plus sign. Examples: +1234567890, 123-456-789, 123
              456 7890
            </small>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="gitbuh">GitHub Handle</label>
          <div className="input-group input-group">
            <input
              id="github"
              type="text"
              className="form-control input-lg"
              name="githubHandle"
              placeholder="The github username of this agent"
              value={githubHandle || ''}
              onChange={(event) => {
                setGithubHandle(event.target.value);
              }}
              onBlur={saveChanges}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="col">
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={handleRemoveAgent}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center"> {confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="mt-5">
        <TabGroup>
          {agentButtons()} {<SmallAddTabBtn onClickHandler={addAgent} />}{' '}
        </TabGroup>
      </div>
      <div className="row justify-content-center">
        {agentsData.length ? (
          selectedAgentInfo()
        ) : (
          <NoDataFound
            text={`This DSO does not have any agents yet. You can add an agent clicking on the "+" button`}
          />
        )}
      </div>
    </div>
  );
};

export default Agents;
