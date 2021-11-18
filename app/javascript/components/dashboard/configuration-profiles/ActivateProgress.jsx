import Modal from "react-modal";
import React from "react";
import { SlideInDown } from "../../shared/Animations";
import { CenteredRoundedCard } from "./utils";
import Loader from "../../shared/Loader";

/**
 * @prop {Boolean} visible
 */
const ActivateProgress = (props) => {
  Modal.setAppElement("body");

  const { visible } = props;

  const steps = [
    {
      id: 1,
      name: "Creating Configuration Profile Metadata",
    },
    {
      id: 2,
      name: "Creating Abstract Classes",
    },
    {
      id: 3,
      name: "Creating Mapping Predicates",
    },
    {
      id: 4,
      name: "Creating DSO's",
    },
  ];

  const data = {
    message:
      "Please wait, we are creating all the necessary elements to get this configuration profile activated. It could take a few minutes.",
    title: "Activating Configuration Profile",
  };

  const renderSteps = () => {
    return steps.map((step) => {
      return (
        <div
          className="card mb-5"
          key={step.id}
          style={{
            maxWidth: "50%",
            margin: "auto",
            borderRadius: "10px",
          }}
        >
          <div className="card-header">
            <div className="row">
              <div className="col-2">
                <div
                  className="col-primary text-center"
                  style={{
                    position: "inherit",
                    transform: "translate(-50%, -50%)",
                    top: "50%",
                    left: "50%",
                  }}
                >
                  <h6 style={{ fontWeight: "bold" }}>{step.id}</h6>
                </div>
              </div>
              <div className="col-10 text-center">
                <h5>{step.name}</h5>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Modal
      isOpen={visible}
      className={"fit-content-height"}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <SlideInDown>
        <div className="row justify-content-center mt-5">
          <CenteredRoundedCard
            title={data.title}
            subtitle={
              <h4 className="text-center mb-5" style={{ fontStyle: "italic" }}>
                {data.message}
              </h4>
            }
            styles={{ transform: "translate(0, 10%)" }}
          >
            <Loader />
            {renderSteps()}
          </CenteredRoundedCard>
        </div>
      </SlideInDown>
    </Modal>
  );
};

export default ActivateProgress;
