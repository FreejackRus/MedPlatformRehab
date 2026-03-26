import { useParams } from "react-router-dom";
import PatientWorkspace from "../../widgets/patient-workspace/index.jsx";

function PatientPage(props) {
  const { screen = "overview" } = useParams();

  return <PatientWorkspace {...props} screen={screen} />;
}

export default PatientPage;
