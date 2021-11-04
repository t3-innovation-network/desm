import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import {
  NoDataFound,
  SmallAddTabBtn,
  SmallRemovableTab,
  TabGroup,
} from "../utils";

const Agents = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];
  const [agentsData, setAgentsData] = useState([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [agentFullname, setAgentFullname] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove agent ${agentFullname}`;
  const dispatch = useDispatch();

  const addAgent = () => {
    let localCP = currentCP;
    setAgentsData([
      ...agentsData,
      {
        fullname: `Mapper N${agentsData.length + 1}`,
        email: "",
        phone: "",
        githubHandle: "",
      },
    ]);

    localCP.structure.standardsOrganizations[
      currentDSOIndex
    ].dsoAgents = agentsData;

    setCurrentAgentIndex(agentsData.length);
    dispatch(setCurrentConfigurationProfile(localCP));
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
    let localCP = currentCP;
    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents[
      currentAgentIndex
    ] = {
      fullname: agentFullname,
      email: agentEmail,
      phone: agentPhone,
      githubHandle: githubHandle,
    };

    return localCP;
  };

  const handleBlur = () => {
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
    let newAgentsData =
      localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents;

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
        <div className="mt-5">
          <label>
            Agent Full Name
            <span className="text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="fullname"
              placeholder="The name of this agent"
              value={agentFullname || ""}
              onChange={(event) => {
                setAgentFullname(event.target.value);
              }}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-5">
          <label>
            Agent Email
            <span className="text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="agentEmail"
              placeholder="The email of this agent"
              value={agentEmail || ""}
              onChange={(event) => {
                setAgentEmail(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Agent Phone</label>
          <div className="input-group input-group">
            <input
              type="tel"
              pattern="(-()[0-9]+)+$"
              className="form-control input-lg"
              name="agentPhone"
              placeholder="The phone of this agent"
              value={agentPhone || ""}
              onChange={(event) => {
                setAgentPhone(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>GitHub Handle</label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="githubHandle"
              placeholder="The github username of this agent"
              value={githubHandle || ""}
              onChange={(event) => {
                setGithubHandle(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    );
  };

  const updateAgentsData = () => {
    let data = agentsData;
    data[currentAgentIndex] = {
      fullname: agentFullname,
      email: agentEmail,
      phone: agentPhone,
      githubHandle: githubHandle,
    };

    setAgentsData(data);
  };

  useEffect(() => {
    if (currentAgentIndex < 0) {
      return;
    }

    const agent = agentsData[currentAgentIndex];
    if (agent) {
      setAgentFullname(agent.fullname);
      setAgentEmail(agent.email);
      setAgentPhone(agent.phone);
      setGithubHandle(agent.githubHandle);
    }
  }, [currentAgentIndex, currentDSOIndex]);

  useEffect(() => {
    const dsoAgents = getDsos()[currentDSOIndex]?.dsoAgents || [];
    setAgentsData(dsoAgents);
    setCurrentAgentIndex(dsoAgents.length ? 0 : -1);
  }, [currentDSOIndex]);

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
      <div className="mt-5 ml-3">
        <TabGroup>
          {agentButtons()} {<SmallAddTabBtn onClickHandler={addAgent} />}{" "}
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
