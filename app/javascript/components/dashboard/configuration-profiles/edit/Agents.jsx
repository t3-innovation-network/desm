import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const confirmationMsg = `Please confirm if you really want to remove agent ${fullname}`;
  const dispatch = useDispatch();

  const addAgent = () => {
    let localCP = currentCP;
    setAgentsData([
      ...agentsData,
      {
        fullname: `Mapper N${agentsData.length + 1}`,
      },
    ]);

    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents = agentsData;

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
    const localCP = currentCP;

    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents[
      currentAgentIndex
    ] = _.pickBy({ email, fullname, githubHandle, phone, leadMapper });

    return localCP;
  };

  const saveChanges = () => {
    dispatch(setSavingCP(true));

    updateCP(currentCP.id, buildCpData()).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
    });

    updateAgentsData();
  };

  const handleRemoveAgent = () => {
    setConfirmationVisible(false);
    let localCP = currentCP;
    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents.splice(
      currentAgentIndex,
      1
    );
    let newAgentsData = localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents;

    setAgentsData(newAgentsData);
    setCurrentAgentIndex(newAgentsData.length - 1);
    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const save = () => {
    dispatch(setSavingCP(true));

    updateCP(currentCP.id, currentCP).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
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
            />
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

  const updateAgentsData = () => {
    let data = agentsData;
    const leadMapper = leadMapperRef.current;

    data[currentAgentIndex] = _.pickBy({
      email,
      fullname,
      githubHandle,
      phone,
      leadMapper,
    });

    setAgentsData(data);
  };

  useEffect(() => {
    const dsoAgents = getDsos()[currentDSOIndex]?.dsoAgents || [];
    setAgentsData(dsoAgents);
    setCurrentAgentIndex(dsoAgents.length ? 0 : -1);
  }, [currentDSOIndex]);

  useEffect(() => {
    if (currentAgentIndex < 0) {
      return;
    }

    const agent = agentsData[currentAgentIndex];

    if (agent) {
      setFullname(agent.fullname);
      setEmail(agent.email);
      setLeadMapper((leadMapperRef.current = Boolean(agent.leadMapper)));
      setPhone(agent.phone);
      setGithubHandle(agent.githubHandle);
    }
  }, [currentAgentIndex, currentDSOIndex]);

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
